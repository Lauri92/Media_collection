'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

// Get likes and dislikes of a media
const getLikesById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT SUM(likes) AS likes,\n' +
        '       SUM(dislikes) AS dislikes,\n' +
        '        media_id\n' +
        'FROM    likes\n' +
        'WHERE media_id = ?\n' +
        'GROUP BY media_id;', [id]);
    return rows;
  } catch (e) {
    console.error('likeMode getLikesById: ', e.message);
  }
};

// Inser a like or a dislike
const createUserLike = async (req) => {
  try {
    console.log('likeModel createUserLike id: ', req.body);
    const [rows] = await promisePool.execute(
        `INSERT INTO likes (media_id, likes, dislikes, user_id) 
        VALUES(?, ?, ?, ?)`,
        [
          req.body.media_id,
          req.body.likes,
          req.body.dislikes,
          req.body.user_id],
    );
    return rows;
  } catch (err) {
    console.error('likeModel createUserLike: ', err.message);
  }
};

// Check if user has liked or disliked already
const likeStatus = async (req, res) => {
  try {
    console.log('likeModel likeStatus :', req.body.user_id, req.body.media_id);
    const [rows] = await promisePool.execute('SELECT likes, dislikes\n' +
        ' FROM likes\n' +
        '  WHERE user_id = ? AND\n' +
        '   media_id = ?;', [
      req.body.user_id,
      req.body.media_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getLikesById,
  createUserLike,
  likeStatus
};