'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

// Get all media by their posting date
const getAllMedia = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.user_id, wop_testpic.mediatype\n' +
        'FROM wop_testuser\n' +
        'INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
        'ORDER BY wop_testpic.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('picModel getAllVideos: ', e.message);
  }
};

//Returns pics by their posting date, aka most recent
const getAllPics = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.user_id, wop_testpic.mediatype\n' +
        ' FROM wop_testuser \n' +
        '  INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
        '   WHERE wop_testpic.mediatype = \'image\' \n' +
        '    ORDER BY wop_testpic.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('picModel getAllPics: ', e.message);
  }
};

//Returns videos by their posting date, aka most recent
const getAllVideos = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.user_id, wop_testpic.mediatype \n' +
        ' FROM wop_testuser \n' +
        '  INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id \n' +
        '   WHERE wop_testpic.mediatype = \'video\' \n' +
        '    ORDER BY wop_testpic.post_date DESC');
    return rows;
  } catch (e) {
    console.error('picModel getAllVideos: ', e.message);
  }
};

// Returns all media by most liked
const getMediaByMostLikes = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT IFNULL(SUM(wop_testlikes.likes), 0) likes, wop_testpic.pic_id, wop_testpic.description, wop_testpic.filename, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testuser.name, wop_testuser.lastname, wop_testpic.mediatype\n' +
        'FROM wop_testpic \n' +
        'LEFT JOIN wop_testlikes ON wop_testpic.pic_id = wop_testlikes.pic_id \n' +
        'LEFT JOIN wop_testuser ON wop_testpic.user_id = wop_testuser.user_id\n' +
        'group by wop_testpic.pic_id\n' +
        'ORDER BY LIKES DESC');
    return rows;
  } catch (e) {
    console.error('picModel getMediaByMostLikes', e.message);
  }
};

// Returns single media item of a user, used for showing added row
const getMediaById = async (id) => {
  try {
    console.log('picModel getMediaById', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_testpic WHERE pic_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('picModel getMediaById:', e.message);
  }
};

// Returns all of users media
const getMediaByOwner = async (user_id) => {
  try {
    console.log('picModel getMediaByOwner id:', user_id);
    if (user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.mediatype \n' +
          ' FROM wop_testuser INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
          '  WHERE wop_testuser.user_id = ?\n' +
          '   ORDER BY wop_testpic.post_date DESC;', [user_id]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('picModel getMediaByOwner error:', e.message);
  }
};

// Returns all of users chosen media
const getChosenMediaByOwner = async (req) => {
  try {
    console.log('picModel getChosenMediaByOwner req.body:', req.body);
    if (req.body.user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.mediatype\n' +
          'FROM wop_testuser INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
          'WHERE wop_testuser.user_id = ? AND\n' +
          'wop_testpic.mediatype = ? \n' +
          'ORDER BY wop_testpic.post_date DESC;', [req.body.user_id, req.body.mediatype]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('picModel getChosenMediaByOwner error:', e.message);
  }
};


// Search all database descriptions and order by most liked
const getMediaBySearch = async (input) => {
  try {
    console.log('picModel getMediaBySearch: ', input);
    const [rows] = await promisePool.execute(
        'SELECT IFNULL(COUNT(wop_testlikes.likes), null) likes, wop_testpic.pic_id, wop_testpic.description, wop_testpic.filename, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testuser.name, wop_testuser.lastname, wop_testpic.mediatype\n' +
        'FROM wop_testpic \n' +
        'LEFT JOIN wop_testlikes ON wop_testpic.pic_id = wop_testlikes.pic_id \n' +
        'LEFT JOIN wop_testuser ON wop_testpic.user_id = wop_testuser.user_id\n' +
        'WHERE wop_testpic.description LIKE ? \n' +
        'group by wop_testpic.pic_id\n' +
        'ORDER BY LIKES DESC;', [input]);
    return rows;
  } catch (e) {
    console.error(e.message);
  }
};

// Get user id of certain uploaded media
const getMediaUserId = async (pic_id) => {
  try {
    console.log('getMediaUserId');
    const [rows] = await promisePool.execute('SELECT *\n' +
        ' FROM wop_testpic\n' +
        '  WHERE wop_testpic.pic_id = ?;', [pic_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

// Insert any media
const insertMedia = async (req) => {
  console.log('req.body: ', req.body);
  console.log('req.file: ', req.file);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testpic (user_id, description, filename, coords, date, post_date, mediatype)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          req.body.id,
          req.body.description,
          req.file.filename,
          req.body.coords,
          req.body.dateTimeOriginal,
          req.body.postDate,
          req.body.mediatype]);
    console.log('picModel insert: ', rows);
    //Used to display inserted information
    return rows.insertId;
  } catch (e) {
    console.log('picModel insert error: ', e);
    return 0;
  }
};

// Delete any media and associated likes and comments
const deleteMedia = async (pic_id) => {
  console.log('picModel deleteMedia pic_id: ', pic_id);
  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM wop_testpic WHERE pic_id = ?', [pic_id]);
    const [rows2] = await promisePool.execute(
        'DELETE FROM wop_testcomments WHERE pic_id = ?', [pic_id]);
    const [rows3] = await promisePool.execute(
        'DELETE FROM wop_testlikes WHERE pic_id = ?', [pic_id]);
    return 'deleted pic and associated likes and comments';
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getAllPics,
  getAllVideos,
  getMediaById,
  getMediaByOwner,
  insertMedia,
  getMediaByMostLikes,
  getMediaBySearch,
  getMediaUserId,
  deleteMedia,
  getChosenMediaByOwner,
  getAllMedia
};


