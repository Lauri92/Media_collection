'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

// Insert any media
const insertHashtags = async (req) => {
  console.log('req.body: ', req.body);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO hashtags (tag, media_id)' +
        'VALUES (?, ?)',
        [
          req.body.tag,
          req.body.media_id,
        ]);
    console.log('hashtagModel insert: ', rows);
    //Used to display inserted information
    return rows.insertId;
  } catch (e) {
    console.log('hashtagModel insert error: ', e);
    return 0;
  }
};

// Get all hashtags of certain media
const getAllHashtags = async (req) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT tag FROM hashtags WHERE media_id = ?', [req.body.id],
    );
    return rows;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  insertHashtags,
  getAllHashtags
};