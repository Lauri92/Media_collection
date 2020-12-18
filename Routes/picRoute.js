'use strict';
//userRoute
const express = require('express');
const picController = require('../Controllers/picController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');
const english = require('naughty-words/en.json')

// Prevent multer for saving wrong file types
const fileFilter = (req, file, cb) => {
  console.log(`fileFilter file: ${file.mimetype}`);
  // Only accept images and videos
  try {
    if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
      return cb(null, true);
    } else {
      return cb(null, false, new Error('not an image or video'));
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Upload image and add size limit
const limits = { fileSize: 50 * 1024 * 1024 };  //50MB
const upload = multer({limits: limits, dest: 'Uploads/', fileFilter});


const injectFile = (req, res, next) => {
  console.log('injectFile req.file: ', req.file);
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

// Get all media
router.get('/media', picController.media_list_get);

// Get all images
router.get('/pics', picController.pic_list_get);

// Get all videos
router.get('/videos', picController.video_list_get);

// Get all media of user
router.route('/userpics').get(picController.media_get_by_owner);

// Get specified media of user
router.route('/specifiedusermedia/video').get(picController.chosen_media_get_by_owner)
router.route('/specifiedusermedia/image').get(picController.chosen_media_get_by_owner)

// Order all media by most likes
router.get('/mostlikes', picController.media_list_get_by_most_likes);

// Order all media by search input
router.get('/search/:input', picController.media_list_get_by_search);

// Get logged in users media by id
router.get('/picuserid/:pic_id', picController.get_media_user_id);

// Delete media of user
router.delete('/delete/:pic_id', picController.media_delete);

// Upload media
router.route('/')
    //.get(picController.pic_list_get)
    .post(
        upload.single('pic'),
        picController.make_thumbnail,
        injectFile,
        [
          body('description', 'must be at least three characters long and not contain bad words!').
              isLength({min: 3}).not().isIn(english),
          //body('type', 'not image or video').contains('image'),
          body('type', 'not image or video').matches('(?=video|image)'),
        ],
        picController.media_create);



module.exports = router;