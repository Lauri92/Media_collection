'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();


// Returns all comments associated with certain pic
const getCommentsByPicId = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT DISTINCT users.name, users.lastname, users.profile_picture, comments.comment, comments.media_id, comments.date, comments.id AS commentid 
 FROM users INNER JOIN comments ON users.id = comments.user_id 
  WHERE comments.media_id = ?
   ORDER BY comments.date ASC;`, [id]);
    return rows;
  } catch (e) {
    console.error('commentModel getCommentById: ', e.message);
  }
};

// Add comment to a pic
const addComment = async (req) => {
  console.log('commentModel addComment req.body: ', req.body);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO comments (media_id, user_id, comment, date)' +
        'VALUES (?, ?, ?, ?)',
        [
          req.body.media_id,
          req.body.user_id,
          req.body.comment,
          req.body.date]);
    console.log('commentModel addComment: ', rows);
    return rows;
  } catch (e) {
    console.log('commentModel addComment error: ', e);
    return 0;
  }
};

// Get owner of a comment
const getCommentUserId = async (comment_id) => {
  try {
    console.log('getCommentUserId');
    const [rows] = await promisePool.execute('SELECT *\n' +
        ' FROM comments\n' +
        '  WHERE comments.id = ?;', [comment_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

// Delete a comment
const deleteComment = async (comment_id) => {
  console.log('commentModel deleteComment comment_id: ', comment_id);
  try {
    const [rows2] = await promisePool.execute(
        'DELETE FROM comments WHERE id = ?', [comment_id]);
    return `deleted comment with id ${comment_id}`;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getCommentsByPicId,
  addComment,
  getCommentUserId,
  deleteComment
};