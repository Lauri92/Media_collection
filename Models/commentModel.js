'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();


// Returns all comments associated with certain pic
const getCommentsByPicId = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testcomments.comment, wop_testcomments.pic_id, wop_testcomments.date, wop_testcomments.id AS commentid 
 FROM wop_testuser INNER JOIN wop_testcomments ON wop_testuser.user_id = wop_testcomments.user_id 
  WHERE wop_testcomments.pic_id = ?
   ORDER BY wop_testcomments.date DESC;`, [id]);
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
        'INSERT INTO wop_testcomments (pic_id, user_id, comment, date)' +
        'VALUES (?, ?, ?, ?)',
        [
          req.body.pic_id,
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
        ' FROM wop_testcomments\n' +
        '  WHERE wop_testcomments.id = ?;', [comment_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

// Delete a comment
const deleteComment = async (comment_id) => {
  console.log('picModel deletePic comment_id: ', comment_id);
  try {
    const [rows2] = await promisePool.execute(
        'DELETE FROM wop_testcomments WHERE id = ?', [comment_id]);
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