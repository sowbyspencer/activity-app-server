const pool = require("../db.ts");
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();
const { getOrCreateChat } = require("./chat");
const fs = require("fs");
const path = require("path");

// Get activities the user has NOT swiped on
const getUnswipedActivities = async (userId, lat, lon, radius) => {
  if (lat === undefined || lon === undefined) {
    throw new Error("Latitude and longitude are required for location-based activity filtering.");
  }
  console.log(`[QUERY] getUnswipedActivities called with: userId=${userId}, lat=${lat}, lon=${lon}, radius=${radius}`);
  // If no location, try to use last known location from DB (if available)
  let effectiveLat = lat;
  let effectiveLon = lon;
  if ((lat === undefined || lon === undefined) && userId) {
    // Try to get last known location for user from profile (if stored)
    try {
      const userLocRes = await pool.query('SELECT lat, lon FROM "user" WHERE id = $1', [userId]);
      if (userLocRes.rows.length > 0 && userLocRes.rows[0].lat && userLocRes.rows[0].lon) {
        effectiveLat = userLocRes.rows[0].lat;
        effectiveLon = userLocRes.rows[0].lon;
        console.log(`[QUERY] Using last known user location from DB: lat=${effectiveLat}, lon=${effectiveLon}`);
      }
    } catch (e) {
      console.log("[QUERY] Could not get last known user location:", e.message);
    }
  }
  const query = `
    SELECT 
      a.id, a.name, a.description, a.lat, a.lon, a.has_cost, a.cost,
      a.available_sun, a.available_mon, a.available_tue, a.available_wed, a.available_thu, a.available_fri, a.available_sat,
      a.url,
      COALESCE(json_agg(ai.image_url) FILTER (WHERE ai.image_url IS NOT NULL), '[]') AS images,
      CASE WHEN $2::DOUBLE PRECISION IS NOT NULL AND $3::DOUBLE PRECISION IS NOT NULL THEN (
        6371 * acos(
          cos(radians($2::DOUBLE PRECISION)) * cos(radians(a.lat)) *
          cos(radians(a.lon) - radians($3::DOUBLE PRECISION)) +
          sin(radians($2::DOUBLE PRECISION)) * sin(radians(a.lat))
        )
      ) ELSE NULL END AS distance
    FROM activity a
    LEFT JOIN activity_image ai ON a.id = ai.activity_id
    WHERE a.id NOT IN (
      SELECT activity_id FROM swipe WHERE user_id = $1
    )
    AND (
      $2::DOUBLE PRECISION IS NULL OR $3::DOUBLE PRECISION IS NULL OR $4::DOUBLE PRECISION IS NULL OR (
        a.lat IS NOT NULL AND a.lon IS NOT NULL AND
        (
          6371 * acos(
            cos(radians($2::DOUBLE PRECISION)) * cos(radians(a.lat)) *
            cos(radians(a.lon) - radians($3::DOUBLE PRECISION)) +
            sin(radians($2::DOUBLE PRECISION)) * sin(radians(a.lat))
          ) <= $4::DOUBLE PRECISION
        )
      )
    )
    GROUP BY a.id, a.name, a.description, a.lat, a.lon, a.has_cost, a.cost,
      a.available_sun, a.available_mon, a.available_tue, a.available_wed,
      a.available_thu, a.available_fri, a.available_sat, a.url
    ORDER BY a.id;
  `;
  const params = [userId, effectiveLat, effectiveLon, radius];
  const result = await pool.query(query, params);
  return result.rows;
};

// Record a swipe (like/dislike) for a user on an activity
const recordSwipe = async (userId, activityId, liked) => {
  // liked: boolean (true = swipe up/like, false = swipe down/dislike)
  const result = await pool.query(
    `INSERT INTO swipe (user_id, activity_id, liked, swiped_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *;`,
    [userId, activityId, liked]
  );

  let addedToActivityMember = false;
  let directChats = [];

  // If liked, add to activity_member if not already present
  if (liked) {
    const activityMemberRes = await pool.query(
      `INSERT INTO activity_member (activity_id, user_id)
       SELECT $1, $2
       WHERE NOT EXISTS (
         SELECT 1 FROM activity_member WHERE activity_id = $1 AND user_id = $2
       )
       RETURNING *;`,
      [activityId, userId]
    );
    addedToActivityMember = activityMemberRes.rows.length > 0;

    // --- NEW LOGIC: Create direct chats with all other members ---
    // Get all other user IDs in this activity (excluding the new member)
    // --- NEW LOGIC: Add user to group chat (activity chat) as well ---
    await getOrCreateChat({
      chat_type: "activity",
      activity_id: activityId,
      user_ids: [userId],
    });
    // --- existing direct chat logic ---
    const otherMembersRes = await pool.query(`SELECT user_id FROM activity_member WHERE activity_id = $1 AND user_id != $2`, [activityId, userId]);
    const otherUserIds = otherMembersRes.rows.map((row) => row.user_id);
    for (const otherUserId of otherUserIds) {
      // Create or fetch direct chat between userId and otherUserId
      const chat = await getOrCreateChat({
        chat_type: "direct",
        user_ids: [userId, otherUserId],
      });
      directChats.push({
        chat_id: chat.id,
        user_ids: [userId, otherUserId],
        created: chat.created_at ? true : false,
      });
    }
  }

  return {
    swipe: result.rows[0],
    addedToActivityMember,
    directChats,
  };
};

// Reset swipes for a user (remove all their swipes except likes that are in activity_member)
const resetSwipes = async (userId) => {
  // Remove all swipes for this user EXCEPT those that are liked and have a matching activity_member
  await pool.query(
    `
    DELETE FROM swipe
    WHERE user_id = $1
      AND (liked = FALSE OR activity_id NOT IN (
        SELECT activity_id FROM activity_member WHERE user_id = $1
      ))
  `,
    [userId]
  );
};

// Create a new activity
const createActivity = async ({
  name,
  lat,
  lon,
  has_cost,
  cost,
  url,
  description,
  user_id,
  images,
  available_sun,
  available_mon,
  available_tue,
  available_wed,
  available_thu,
  available_fri,
  available_sat,
}) => {
  // Validate cost field
  const validatedCost = cost === "" || cost === null ? null : parseFloat(cost);
  if (validatedCost !== null && isNaN(validatedCost)) {
    throw new Error("Invalid cost value. Must be a number or null.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert activity
    const activityResult = await client.query(
      `INSERT INTO activity (name, lat, lon, has_cost, cost, url, description, user_id, available_sun, available_mon, available_tue, available_wed, available_thu, available_fri, available_sat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *;`,
      [
        name,
        lat,
        lon,
        has_cost,
        validatedCost,
        url,
        description,
        user_id,
        available_sun,
        available_mon,
        available_tue,
        available_wed,
        available_thu,
        available_fri,
        available_sat,
      ]
    );

    const activityId = activityResult.rows[0].id;

    // Insert images
    if (images && images.length > 0) {
      const imageQueries = images.map((imageUrl) => {
        return client.query(
          `INSERT INTO activity_image (activity_id, image_url)
           VALUES ($1, $2);`,
          [activityId, imageUrl]
        );
      });
      await Promise.all(imageQueries);
    }

    await client.query("COMMIT");
    return activityResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Leave or unlike an activity: remove from activity_member, group chat, and direct chats if no other shared activities
const leaveActivity = async (userId, activityId) => {
  // Remove from activity_member
  await pool.query(`DELETE FROM activity_member WHERE user_id = $1 AND activity_id = $2`, [userId, activityId]);

  // Reset swipe entries for this user and activity
  await pool.query(`DELETE FROM swipe WHERE user_id = $1 AND activity_id = $2`, [userId, activityId]);

  // Remove from group chat (activity chat)
  const groupChatRes = await pool.query(`SELECT id FROM chat WHERE chat_type = 'activity' AND activity_id = $1`, [activityId]);
  if (groupChatRes.rows.length > 0) {
    const groupChatId = groupChatRes.rows[0].id;
    await pool.query(`DELETE FROM chat_member WHERE chat_id = $1 AND user_id = $2`, [groupChatId, userId]);
    // Delete messages from this user in the activity chat
    await pool.query(`DELETE FROM message WHERE chat_id = $1 AND user_id = $2`, [groupChatId, userId]);
  }

  // Remove from direct chats if no other shared activities
  const otherUsersRes = await pool.query(`SELECT user_id FROM activity_member WHERE activity_id = $1 AND user_id != $2`, [activityId, userId]);
  const otherUserIds = otherUsersRes.rows.map((row) => row.user_id);
  for (const otherUserId of otherUserIds) {
    // Check if user and otherUserId share any other activities
    const sharedRes = await pool.query(
      `SELECT 1 FROM activity_member WHERE user_id = $1 AND activity_id IN (
        SELECT activity_id FROM activity_member WHERE user_id = $2
      ) AND activity_id != $3 LIMIT 1`,
      [userId, otherUserId, activityId]
    );
    if (sharedRes.rows.length === 0) {
      // No other shared activities, delete direct chat
      const chatRes = await pool.query(
        `SELECT c.id FROM chat c
         JOIN chat_member cm1 ON c.id = cm1.chat_id
         JOIN chat_member cm2 ON c.id = cm2.chat_id
         WHERE c.chat_type = 'direct' AND cm1.user_id = $1 AND cm2.user_id = $2`,
        [userId, otherUserId]
      );
      if (chatRes.rows.length > 0) {
        const chatId = chatRes.rows[0].id;
        // Remove both users from chat_member
        await pool.query(`DELETE FROM chat_member WHERE chat_id = $1 AND (user_id = $2 OR user_id = $3)`, [chatId, userId, otherUserId]);
        // Optionally, delete the chat if no members left
        await pool.query(`DELETE FROM chat WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM chat_member WHERE chat_id = $1)`, [chatId]);
        // Delete messages from both users in this direct chat
        await pool.query(`DELETE FROM message WHERE chat_id = $1 AND (user_id = $2 OR user_id = $3)`, [chatId, userId, otherUserId]);
      }
    }
  }
  return { success: true };
};

// Get activities created by a specific user
const getActivitiesByCreator = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      a.id, 
      a.name, 
      a.description,
      a.lat, 
      a.lon, 
      a.has_cost, 
      a.cost, 
      a.available_sun, 
      a.available_mon, 
      a.available_tue, 
      a.available_wed, 
      a.available_thu, 
      a.available_fri, 
      a.available_sat,
      a.url,
      COALESCE(json_agg(ai.image_url) FILTER (WHERE ai.image_url IS NOT NULL), '[]') AS images
    FROM activity a
    LEFT JOIN activity_image ai ON a.id = ai.activity_id
    WHERE a.user_id = $1
    GROUP BY 
      a.id, a.name, a.description, a.lat, a.lon, a.has_cost, a.cost,
      a.available_sun, a.available_mon, a.available_tue, a.available_wed,
      a.available_thu, a.available_fri, a.available_sat, a.url
    ORDER BY a.id;
    `,
    [userId]
  );
  return result.rows;
};

// Edit an existing activity (moved from editActivity.js)
const editActivity = async (fields) => {
  const { id } = fields;
  if (!id) throw new Error("Activity ID is required");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch current activity
    const currentRes = await client.query(`SELECT * FROM activity WHERE id = $1`, [id]);
    if (currentRes.rows.length === 0) throw new Error("Activity not found");
    const current = currentRes.rows[0];

    // Fetch current images
    const currentImagesRes = await client.query(`SELECT image_url FROM activity_image WHERE activity_id = $1`, [id]);
    const currentImages = currentImagesRes.rows.map((row) => row.image_url);

    // Merge fields: use provided value if present, else current value
    const name = fields.name !== undefined ? fields.name : current.name;
    const lat = fields.lat !== undefined ? fields.lat : current.lat;
    const lon = fields.lon !== undefined ? fields.lon : current.lon;
    const has_cost = fields.has_cost !== undefined ? fields.has_cost : current.has_cost;
    let cost = fields.cost !== undefined ? fields.cost : current.cost;
    const url = fields.url !== undefined ? fields.url : current.url;
    const description = fields.description !== undefined ? fields.description : current.description;
    const user_id = fields.user_id !== undefined ? fields.user_id : current.user_id;
    const available_sun = fields.available_sun !== undefined ? fields.available_sun : current.available_sun;
    const available_mon = fields.available_mon !== undefined ? fields.available_mon : current.available_mon;
    const available_tue = fields.available_tue !== undefined ? fields.available_tue : current.available_tue;
    const available_wed = fields.available_wed !== undefined ? fields.available_wed : current.available_wed;
    const available_thu = fields.available_thu !== undefined ? fields.available_thu : current.available_thu;
    const available_fri = fields.available_fri !== undefined ? fields.available_fri : current.available_fri;
    const available_sat = fields.available_sat !== undefined ? fields.available_sat : current.available_sat;

    // Validate cost
    if (cost === "" || cost === null) cost = null;
    else {
      cost = parseFloat(cost);
      if (cost !== null && isNaN(cost)) throw new Error("Invalid cost value. Must be a number or null.");
    }

    // Update activity
    const activityResult = await client.query(
      `UPDATE activity
       SET name = $1, lat = $2::DOUBLE PRECISION, lon = $3::DOUBLE PRECISION, has_cost = $4, cost = $5, url = $6, description = $7, user_id = $8,
           available_sun = $9, available_mon = $10, available_tue = $11, available_wed = $12, available_thu = $13, available_fri = $14, available_sat = $15
       WHERE id = $16
       RETURNING *;`,
      [
        name,
        lat,
        lon,
        has_cost,
        cost,
        url,
        description,
        user_id,
        available_sun,
        available_mon,
        available_tue,
        available_wed,
        available_thu,
        available_fri,
        available_sat,
        id,
      ]
    );

    const activityId = activityResult.rows[0].id;

    // Update images if provided
    if (fields.images && fields.images.length > 0) {
      // Find images to delete (present in DB, not in new list)
      const imagesToDelete = currentImages.filter((img) => !fields.images.includes(img));
      // Delete files from disk using IMAGE_PATH from .env (replace up to /activities/ with local path)
      for (const imgUrl of imagesToDelete) {
        if (imgUrl) {
          // Convert IMAGE_PATH URL to local file path
          const imagePathEnv = process.env.IMAGE_PATH;
          const localBase = path.join(__dirname, "../public/images");
          let localPath = imgUrl;
          if (imagePathEnv && imgUrl.startsWith(imagePathEnv)) {
            // Hosted: replace IMAGE_PATH with localBase
            localPath = path.join(localBase, imgUrl.replace(imagePathEnv, "").replace(/^\//, ""));
          } else {
            // Local: remove protocol/domain up to /activities/
            const idx = imgUrl.indexOf("/activities/");
            if (idx !== -1) {
              localPath = path.join(localBase, imgUrl.substring(idx + 1));
            }
          }
          try {
            if (fs.existsSync(localPath)) {
              fs.unlinkSync(localPath);
              console.log("[editActivity] Deleted image file:", localPath);
            } else {
              console.log("[editActivity] File not found for deletion:", localPath);
            }
          } catch (err) {
            console.error(chalk.red("[editActivity] Error deleting image file:"), localPath, err);
          }
        }
      }
      // Only update DB if the image is new, otherwise keep the preexisting url
      await client.query(`DELETE FROM activity_image WHERE activity_id = $1;`, [activityId]);
      const imageQueries = fields.images.map((imageUrl) => {
        // If the imageUrl exists in currentImages, use the original DB value (preexisting url)
        const original = currentImages.find((img) => img === imageUrl);
        const toInsert = original || imageUrl;
        return client.query(
          `INSERT INTO activity_image (activity_id, image_url)
           VALUES ($1, $2);`,
          [activityId, toInsert]
        );
      });
      await Promise.all(imageQueries);
    }

    await client.query("COMMIT");
    return activityResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Delete an activity and its images
const deleteActivity = async (activityId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Get all image URLs for this activity
    const imgRes = await client.query(`SELECT image_url FROM activity_image WHERE activity_id = $1`, [activityId]);
    const images = imgRes.rows.map((row) => row.image_url);
    // Delete images from disk
    const imagePathEnv = process.env.IMAGE_PATH;
    const localBase = path.join(__dirname, "../public/images");
    for (const imgUrl of images) {
      let localPath = imgUrl;
      if (imagePathEnv && imgUrl.startsWith(imagePathEnv)) {
        localPath = path.join(localBase, imgUrl.replace(imagePathEnv, "").replace(/^\//, ""));
      } else {
        const idx = imgUrl.indexOf("/activities/");
        if (idx !== -1) {
          localPath = path.join(localBase, imgUrl.substring(idx + 1));
        }
      }
      try {
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (err) {
        console.error(chalk.red("[deleteActivity] Error deleting image file:"), localPath, err);
      }
    }
    // Delete from activity_image (if not ON DELETE CASCADE)
    await client.query(`DELETE FROM activity_image WHERE activity_id = $1`, [activityId]);
    // Delete the activity
    await client.query(`DELETE FROM activity WHERE id = $1`, [activityId]);
    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getUnswipedActivities,
  recordSwipe,
  resetSwipes,
  createActivity,
  leaveActivity,
  getActivitiesByCreator,
  editActivity,
  deleteActivity,
};
