const pool = require("../db.ts");

const editActivity = async ({
  id,
  name,
  location,
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
  const validatedCost = cost === "" || cost === null ? null : parseFloat(cost);
  if (validatedCost !== null && isNaN(validatedCost)) {
    throw new Error("Invalid cost value. Must be a number or null.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update activity
    const activityResult = await client.query(
      `UPDATE activity
       SET name = $1, location = $2, has_cost = $3, cost = $4, url = $5, description = $6, user_id = $7,
           available_sun = $8, available_mon = $9, available_tue = $10, available_wed = $11,
           available_thu = $12, available_fri = $13, available_sat = $14
       WHERE id = $15
       RETURNING *;`,
      [
        name,
        location,
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
        id,
      ]
    );

    const activityId = activityResult.rows[0].id;

    // Update images
    if (images && images.length > 0) {
      await client.query(`DELETE FROM activity_image WHERE activity_id = $1;`, [activityId]);

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

module.exports = { editActivity };
