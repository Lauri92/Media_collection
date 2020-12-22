'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

// Get all users from database
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM users');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers: ', e.message);
  }
};

// Get user by specific id
const getUser = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel getUser: ', e.message);
  }
};

// Add a user
const insertUser = async (req) => {
  console.log('userModel req.body: ', req.body);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO users (name, lastname, email, password, admin, profile_picture)' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [
          req.body.name,
          req.body.lastname,
          req.body.email,
          req.body.password,
          req.body.admin,
          req.body.profile_picture]);
    console.log('userModel insert: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('userModel insert error: ', e);
    return 0;
  }
};

// Update user profile picture
const updateProfilePic = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE users SET profile_picture = ? WHERE id = ?',
        [
          req.file.filename,
          req.body.id,
        ]);
    console.log('userModel insert: ', rows);
    // TODO: Alter return value
    return ({'message': 'Profile picture updated'});
  } catch (e) {
    console.error(e.message);
  }
};

// TODO: Check if this function is actually relevant anymore
// Get users email
const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM users WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

// For checking email availability in database
const checkEmailAvailability = async (req, res) => {
  try {
    console.log('userModel checkEmailAvalability');
    const [rows] = await promisePool.execute('SELECT *\n' +
        'FROM users\n' +
        'WHERE users.email = ?;', [req.body.email]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getUserLogin,
  insertUser,
  checkEmailAvailability,
  updateProfilePic,
};