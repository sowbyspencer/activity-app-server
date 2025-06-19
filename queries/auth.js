const pool = require("../db.ts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async ({ email, password, first_name, last_name }) => {
  // Check if the email already exists
  const emailCheck = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  if (emailCheck.rows.length > 0) {
    return { error: "The email address is already registered. Please use a different email." };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO "user" (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)`, [
    email,
    hashedPassword,
    first_name,
    last_name,
  ]);
  return { message: "Registration successful! You can now log in." };
};

// Login user
const loginUser = async ({ email, password, jwtSecret }) => {
  const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  const user = result.rows[0];
  if (!user) {
    return { error: "Invalid credentials" };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "1h" });
  return { token, user_id: user.id };
};

// Get all registered users (for verification)
const getAllRegisteredUsers = async () => {
  const result = await pool.query('SELECT email, first_name, last_name FROM "user"');
  return result.rows;
};

module.exports = { registerUser, loginUser, getAllRegisteredUsers };
