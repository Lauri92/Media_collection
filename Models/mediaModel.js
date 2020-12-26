'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

// Get all media by their posting date
const getAllMedia = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT users.name, users.lastname, medias.description, medias.coords, medias.date, medias.post_date, medias.filename, medias.id, medias.user_id, medias.mediatype, users.profile_picture\n' +
        'FROM users\n' +
        'INNER JOIN medias ON users.id = medias.user_id\n' +
        'ORDER BY medias.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('mediaModel getAllMedia: ', e.message);
  }
};

//Returns pics by their posting date, aka most recent
const getAllPics = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT users.name, users.lastname, medias.description, medias.coords, medias.date, medias.post_date, medias.filename, medias.id, medias.user_id, medias.mediatype, users.profile_picture\n' +
        ' FROM users \n' +
        '  INNER JOIN medias ON users.id = medias.user_id\n' +
        '   WHERE medias.mediatype = \'image\' \n' +
        '    ORDER BY medias.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('mediaModel getAllPics: ', e.message);
  }
};

//Returns videos by their posting date, aka most recent
const getAllVideos = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT users.name, users.lastname, medias.description, medias.coords, medias.date, medias.post_date, medias.filename, medias.id, medias.user_id, medias.mediatype, users.profile_picture \n' +
        ' FROM users \n' +
        '  INNER JOIN medias ON users.id = medias.user_id \n' +
        '   WHERE medias.mediatype = \'video\' \n' +
        '    ORDER BY medias.post_date DESC');
    return rows;
  } catch (e) {
    console.error('mediaModel getAllVideos: ', e.message);
  }
};

// Returns all media by most liked
const getMediaByMostLikes = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT IFNULL(SUM(likes.likes), 0) likes, medias.id, medias.description, medias.filename, medias.coords, medias.date, medias.post_date, users.name, users.lastname, medias.mediatype, users.profile_picture\n' +
        'FROM medias \n' +
        'LEFT JOIN likes ON medias.id = likes.media_id \n' +
        'LEFT JOIN users ON medias.user_id = users.id\n' +
        'group by medias.id\n' +
        'ORDER BY LIKES DESC');
    return rows;
  } catch (e) {
    console.error('mediaModel getMediaByMostLikes', e.message);
  }
};

// Returns single media item of a user, used for showing added row
const getMediaById = async (id) => {
  try {
    console.log('mediaModel getMediaById', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM medias WHERE id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('mediaModel getMediaById:', e.message);
  }
};

// Returns all of users media
const getMediaByOwner = async (user_id) => {
  try {
    console.log('mediaModel getMediaByOwner id:', user_id);
    if (user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT DISTINCT users.name, users.lastname, medias.description, medias.coords, medias.date, medias.post_date, medias.filename, medias.id, medias.mediatype, users.profile_picture \n' +
          ' FROM users INNER JOIN medias ON users.id = medias.user_id\n' +
          '  WHERE users.id = ?\n' +
          '   ORDER BY medias.post_date DESC;', [user_id]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('mediaModel getMediaByOwner error:', e.message);
  }
};

// Returns all of users chosen media
const getChosenMediaByOwner = async (req) => {
  try {
    console.log('mediaModel getChosenMediaByOwner req.body:', req.body);
    if (req.body.user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT DISTINCT users.name, users.lastname, medias.description, medias.coords, medias.date, medias.post_date, medias.filename, medias.id, medias.mediatype, users.profile_picture\n' +
          'FROM users INNER JOIN medias ON users.id = medias.user_id\n' +
          'WHERE users.id = ? AND\n' +
          'medias.mediatype = ? \n' +
          'ORDER BY medias.post_date DESC;', [req.body.user_id, req.body.mediatype]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('mediaModel getChosenMediaByOwner error:', e.message);
  }
};

// Returns the count of chosen medias
const getChosenMediaCountByOwner = async (req) => {
  try {
    console.log('mediaModel getChosenMediaCountByOwner req.body:', req.body);
    if (req.body.user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT COUNT(user_id) count\n' +
          'FROM medias\n' +
          'WHERE user_id = ? AND mediatype = ?;', [req.body.user_id, req.body.mediatype]);
      return rows[0];
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('mediaModel getChosenMediaCountByOwner error:', e.message);
  }
};


// Search all database descriptions for matching input and order by most liked
const getMediaBySearch = async (input) => {
  try {
    console.log('mediaModel getMediaBySearch: ', input);
    const [rows] = await promisePool.execute(
        'SELECT IFNULL(COUNT(likes.likes), null) likes, medias.id, medias.description, medias.filename, medias.coords, medias.date, medias.post_date, users.name, users.lastname, medias.mediatype, users.profile_picture\n' +
        'FROM medias \n' +
        'LEFT JOIN likes ON medias.id = likes.media_id \n' +
        'LEFT JOIN users ON medias.user_id = users.id\n' +
        'WHERE medias.description LIKE ? \n' +
        'group by medias.id\n' +
        'ORDER BY LIKES DESC;', [input]);
    return rows;
  } catch (e) {
    console.error(e.message);
  }
};

// Get user id of certain uploaded media
const getMediaUserId = async (media_id) => {
  try {
    console.log('getMediaUserId');
    const [rows] = await promisePool.execute('SELECT *\n' +
        ' FROM medias\n' +
        '  WHERE medias.id = ?;', [media_id]);
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
        'INSERT INTO medias (user_id, description, filename, coords, date, post_date, mediatype)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          req.body.id,
          req.body.description,
          req.file.filename,
          req.body.coords,
          req.body.dateTimeOriginal,
          req.body.postDate,
          req.body.mediatype]);
    console.log('mediaModel insert: ', rows);
    //Used to display inserted information
    return rows.insertId;
  } catch (e) {
    console.log('mediaModel insert error: ', e);
    return 0;
  }
};

// Delete any media and associated likes and comments and hashtags
const deleteMedia = async (media_id) => {
  console.log('mediaModel deleteMedia media_id: ', media_id);
  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM medias WHERE id = ?', [media_id]);
    const [rows2] = await promisePool.execute(
        'DELETE FROM comments WHERE media_id = ?', [media_id]);
    const [rows3] = await promisePool.execute(
        'DELETE FROM likes WHERE media_id = ?', [media_id]);
    const [rows4] = await promisePool.execute(
        'DELETE FROM hashtags WHERE media_id = ?', [media_id]);

    return 'deleted media and associated likes and comments and hashtag references';
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
  getAllMedia,
  getChosenMediaCountByOwner
};


