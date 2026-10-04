const pool = require('../config/postgres');

// Find user by email
async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT
      id::text AS id,
      name,
      roll_no AS "rollNo",
      email,
      phone,
      branch,
      year,
      block,
      room,
      parent_name AS "parentName",
      parent_phone AS "parentPhone",
      password_hash AS "passwordHash",
      role,
      avatar,
      profile_image AS "profileImage",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM users
    WHERE email = $1
    LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

// Find user by roll number
async function findUserByRollNo(rollNo) {
  const result = await pool.query(
    `SELECT id::text AS id, email
     FROM users
     WHERE roll_no = $1
     LIMIT 1`,
    [rollNo]
  );

  return result.rows[0] || null;
}

// Create new student
async function createUser(user) {
  const result = await pool.query(
    `INSERT INTO users (
      name, roll_no, email, phone, branch, year,
      block, room, password_hash, role, avatar
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING
      id::text AS id,
      name,
      roll_no AS "rollNo",
      email,
      phone,
      branch,
      year,
      block,
      room,
      parent_name AS "parentName",
      parent_phone AS "parentPhone",
      role,
      avatar,
      profile_image AS "profileImage",
      created_at AS "createdAt"`,
    [
      user.name,
      user.rollNo,
      user.email,
      user.phone,
      user.branch,
      user.year,
      user.block || '',
      user.room || '',
      user.passwordHash,
      user.role || 'student',
      user.avatar || ''
    ]
  );

  return result.rows[0];
}

// Find user by ID
async function findUserById(id) {
  const result = await pool.query(
    `SELECT
       id::text AS id,
       name,
       roll_no AS "rollNo",
       email,
       phone,
       branch,
       year,
       block,
       room,
       parent_name AS "parentName",
       parent_phone AS "parentPhone",
       password_hash AS "passwordHash",
       role,
       avatar,
       profile_image AS "profileImage"
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function updateProfileImage(id, imageUrl) {
  const result = await pool.query(
    `UPDATE users
     SET profile_image = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id::text AS id, name, email,
               profile_image AS "profileImage"`,
    [imageUrl, id]
  );

  return result.rows[0] || null;
}
module.exports = {
  findUserByEmail,
  findUserByRollNo,
  createUser,
  findUserById,
  updateProfileImage
};