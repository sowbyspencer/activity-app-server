// -----------------------------------------------------------------------------
// activityGroup.js - Database queries for activity group details
// -----------------------------------------------------------------------------
// Contains SQL/database logic for:
//   - Fetching group details for a specific activity (members, last message, etc.)
//
// Exports: Query functions for use in Express routes
// ----------------------------------------------------------------------------

const pool = require("../db.ts");
let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();

/**
 * Fetch group details for a specific activity and user.
 * Returns group chat info, members, and last message.
 *
 * @param {number|string} activity_id - The activity's ID
 * @param {number|string} user_id - The requesting user's ID
 * @returns {Promise<object>} Group details or error object
 */
const getActivityGroup = async (activity_id, user_id) => {
  try {
    // SQL query uses CTEs to:
    // 1. Find or create the group chat for this activity
    // 2. Get the last group message
    // 3. Get direct chats for the user
    // 4. Aggregate all group members and their direct chat info
    const result = await pool.query(
      `
      WITH group_chat AS (
        SELECT c.id AS chat_id
        FROM chat c
        WHERE c.activity_id = $1
          AND c.chat_type = 'activity'
        LIMIT 1
      ),
      -- If no group chat exists, create one dynamically
      gc AS (
        INSERT INTO chat (chat_type, activity_id)
        SELECT 'activity', $1
        WHERE NOT EXISTS (
          SELECT 1 FROM chat WHERE chat_type = 'activity' AND activity_id = $1
        )
        RETURNING id AS chat_id
      ),
      group_chat_message AS (
        SELECT m.content AS lastMessage
        FROM message m
        JOIN group_chat gc ON m.chat_id = gc.chat_id
        ORDER BY m.sent_at DESC
        LIMIT 1
      ),
      direct_chats AS (
        SELECT 
            c.id AS chat_id,
            cm.user_id,
            (
                SELECT content
                FROM message
                WHERE chat_id = c.id
                ORDER BY sent_at DESC
                LIMIT 1
            ) AS lastMessage
        FROM chat c
        JOIN chat_member cm ON cm.chat_id = c.id
        WHERE c.chat_type = 'direct'
          AND c.id IN (
              SELECT chat_id FROM chat_member WHERE user_id = $2
          )
      )
      SELECT 
        a.id AS "activity_id", 
        a.name AS "activity_name", 
        (
            SELECT image_url
            FROM activity_image
            WHERE activity_id = a.id
            LIMIT 1
        ) AS "activity_image",
        gc.chat_id AS "chat_id",
        gcm.lastMessage AS "lastMessage",
        json_agg(
            DISTINCT jsonb_build_object(
                'id', u.id,
                'name', CONCAT(u.first_name, ' ', u.last_name),
                'profile_image', COALESCE(u.profile_image, ''),
                'chat_id', dc.chat_id,
                'lastMessage', dc.lastMessage
            )
        ) FILTER (WHERE u.id IS NOT NULL AND u.id != $2) AS members
      FROM activity_member am
      JOIN activity a ON am.activity_id = a.id
      JOIN "user" u ON am.user_id = u.id
      LEFT JOIN group_chat gc ON TRUE
      LEFT JOIN group_chat_message gcm ON TRUE
      LEFT JOIN direct_chats dc ON dc.user_id = u.id
      WHERE am.activity_id = $1
      GROUP BY 
        a.id, 
        a.name,
        gc.chat_id, 
        gcm.lastMessage;
      `,
      [activity_id, user_id]
    );

    // Debug logging for development
    console.log(
      "group_chat result:",
      result.rows.map((row) => row.chat_id)
    );
    console.log(
      "direct_chats result:",
      result.rows.map((row) => row.members)
    );
    console.log("getActivityGroup query result:", result.rows);

    // Return group details or error if not found
    return result.rows.length > 0 ? result.rows[0] : { error: "No group found for this activity." };
  } catch (err) {
    // Log and return DB error
    console.error(chalk.red("Error fetching activity group:"), err.message);
    return { error: "Database error while fetching activity group." };
  }
};

// Export the query function for use in routes
module.exports = { getActivityGroup };
