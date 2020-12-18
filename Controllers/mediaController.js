'use strict';

const mediaModel = require('../Models/mediaModel');
const {validationResult} = require('express-validator');
const ImageMeta = require('../Utils/imageMeta');
const {makeThumbnail} = require('../Utils/resize');
const fs = require('fs');

// Get all media
const media_list_get = async (req, res) => {
  const pics = await mediaModel.getAllMedia();
  await res.json(pics);
};

// get all images
const pic_list_get = async (req, res) => {
  const pics = await mediaModel.getAllPics();
  await res.json(pics);
};

// Get all videos
const video_list_get = async (req, res) => {
  const pics = await mediaModel.getAllVideos();
  await res.json(pics);
};

// Controller for getting media by most likes
const media_list_get_by_most_likes = async (req, res) => {
  const pics = await mediaModel.getMediaByMostLikes();
  await res.json(pics);
};

// Controller for getting media by search input
const media_list_get_by_search = async (req, res) => {
  const input = '%' + req.params.input + '%';
  console.log(input);
  const pics = await mediaModel.getMediaBySearch(input);
  await res.json(pics);
};

// Controller for Creating media
const media_create = async (req, res) => {
  //here we will create a pic with data coming from req
  console.log('req.file: ', req.file);

  // Check if validation was passed without errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Error happened in pic validation: ', errors.array());

    // Delete the pic which is tried to be uploaded
    fs.unlink(`Thumbnails/${req.file.filename}`, err => {
      if (err) throw err;
      console.log(
          `Removing Thumbnails/${req.file.filename} because of error in validation.`);
    });
    // Return encountered errors to user
    return res.status(400).json({errors: errors.array()});
  }

  //Add jwt user_id as part of body
  req.body.id = req.user.user_id;

  // Check if the image has any exifData
  const isExifdata = await ImageMeta.checkExifdata(req.file.path);
  console.log(isExifdata);

  if (isExifdata) {
    // Get gps coordinates from image if THIS exifdata is actually available
    if (req.file.mimetype === 'image/jpeg') {
      const coords = await ImageMeta.getCoordinates(req.file.path);
      console.log('coords', coords);
      req.body.coords = coords;
    } else {
      req.body.coords = null;
    }

    // Get timestamp from image if THIS exifdata is actually available
    if (req.file.mimetype === 'image/jpeg') {
      const dateTimeOriginal = await ImageMeta.getDateTimeOriginal(
          req.file.path);
      console.log('dateTimeOriginal', dateTimeOriginal);
      req.body.dateTimeOriginal = dateTimeOriginal;
    } else {
      req.body.dateTimeOriginal = null;
    }
  } else {
    // No exif data available
    req.body.coords = null;
    req.body.dateTimeOriginal = null;
  }

  // Get post_date => current time and add to req.body
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];
  req.body.postDate = date;

  // Check medias mimetype and assing correct value to req.body
  if (req.file.mimetype.includes('image')) {
    req.body.mediatype = 'image';
  } else {
    req.body.mediatype = 'video';
  }

  // Delete Uploaded file from machine if it is image, only Thumbnails are used anyways and now exif data is exctracted too.
  // Videos will be kept in Uploads
  if (req.file.mimetype.includes('image')) {
    try {
      fs.unlink(`Uploads/${req.file.filename}`, err => {
        if (err) throw err;
        console.log(`Removing Uploads/${req.file.filename}`);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  // Insert media, response from model is the Id of inserted media
  const id = await mediaModel.insertMedia(req);
  //Query for media which was inserted
  const pic = await mediaModel.getMediaById(id);
  //...then send info of inserted media to user
  res.send(pic);
};

// Create thumbnails with sharp --> resize.js
const make_thumbnail = async (req, res, next) => {
  console.log('make_thumbnail req.file.mimetype: ', req.file.mimetype);
  // If the posted media is image and not video, create thumbnail and resize
  if (req.file.mimetype.includes('image')) {
    try {
      const ready = await makeThumbnail({width: 800, height: 800},
          req.file.path,
          './Thumbnails/' + req.file.filename);
      if (ready) {
        console.log('make_thumbnail', ready);
        next();
      }
    } catch (e) {
      //return res.status(400).json({errors: e.message});
      next();
    }
    // Media was a video
  } else {
    next();
  }
};

// Get all content posted by user
const media_get_by_owner = async (req, res) => {
  console.log(`picController: http get pic with path param`, req.params);  //params -> id
  const media = await mediaModel.getMediaByOwner(req.user.user_id);
  await res.json(media);
};

// Get specified type of media of a user, path includes requested mediatype
const chosen_media_get_by_owner = async (req, res) => {

  req.body.user_id = req.user.user_id;

  // Check request type
  if (req.path.includes('image')) {
    // Request was of type image
    req.body.mediatype = 'image';
  } else {
    // ... it was video
    req.body.mediatype = 'video';
  }
  const media = await mediaModel.getChosenMediaByOwner(req);
  await res.json(media);
};

// Send true if user is the owner of media, else send false
const get_media_user_id = async (req, res) => {
  const mediaOwner = await mediaModel.getMediaUserId(req.params.pic_id);
  if (mediaOwner.user_id == req.user.user_id || req.user.admin == 1) {
    await res.status(200).send({'result': true});
  } else {
    await res.status(200).send({'result': false});
  }
};

// Delete user media
const media_delete = async (req, res) => {
  // Check user_id of the media
  const mediaOwner = await mediaModel.getMediaUserId(req.params.pic_id);
  console.log('mediaOwner info, is there filename?: ', mediaOwner);

  // mediaOwner user_id matches logged in user or logged in user is admin
  if (mediaOwner.user_id == req.user.user_id || req.user.admin == 1) {

    // Delete files from the machine too
    if (mediaOwner.mediatype === 'image') {
      // mediatype was image
      fs.unlink(`Thumbnails/${mediaOwner.filename}`, err => {
        if (err) throw err;
        console.log(`Removing Thumbnails/${mediaOwner.filename}`);
      });
    } else {
      // ... was a video
      fs.unlink(`Uploads/${mediaOwner.filename}`, err => {
        if (err) throw err;
        console.log(`Removing Uploads/${mediaOwner.filename}`);
      });
    }
    // query to delete reference from db
    const picDeleted = await mediaModel.deleteMedia(req.params.pic_id);
    await res.json(picDeleted);
  }
  //TODO: Handle wrong user... Shouldn't happen
  await res.json({response: 'Wrong user'})
};

module.exports = {
  pic_list_get,
  media_create,
  make_thumbnail,
  media_get_by_owner,
  media_list_get_by_most_likes,
  media_list_get_by_search,
  get_media_user_id,
  media_delete,
  video_list_get,
  chosen_media_get_by_owner,
  media_list_get,
};
