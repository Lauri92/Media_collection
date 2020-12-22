'use strict';
//userRoute
const express = require('express');
const mediaController = require('../Controllers/mediaController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');
const english = require('naughty-words/en.json')
const {mediaFileFilter} = require('../Utils/multerUtil');

// Upload image and add size limit
const limits = { fileSize: 50 * 1024 * 1024 };  //50MB
const upload = multer({limits: limits, dest: 'Uploads/', mediaFileFilter});

const injectFile = (req, res, next) => {
  console.log('injectFile req.file: ', req.file);
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

// Get all media
router.get('/media', mediaController.media_list_get);

// Get all images
router.get('/pics', mediaController.pic_list_get);

// Get all videos
router.get('/videos', mediaController.video_list_get);

// Get all media of user
router.route('/usermedia').get(mediaController.media_get_by_owner);

// Get specified media of user
router.route('/specifiedusermedia/video').get(mediaController.chosen_media_get_by_owner)
router.route('/specifiedusermedia/image').get(mediaController.chosen_media_get_by_owner)

// Get specified media count of user
router.route('/specifiedusermediacount/video').get(mediaController.chosen_media_count_get_by_owner)
router.route('/specifiedusermediacount/image').get(mediaController.chosen_media_count_get_by_owner)

// Order all media by most likes
router.get('/mostlikes', mediaController.media_list_get_by_most_likes);

// Order all media by search input
router.get('/search/:input', mediaController.media_list_get_by_search);

// Get logged in users media by id
router.get('/picuserid/:media_id', mediaController.get_media_user_id);

// Delete media of user
router.delete('/delete/:media_id', mediaController.media_delete);

// Upload media
router.route('/')
    //.get(mediaController.pic_list_get)
    .post(
        upload.single('pic'),
        mediaController.make_thumbnail,
        injectFile,
        [
          body('description', 'must be at least three characters long and not contain bad words!').
              isLength({min: 3}).not().isIn(english),
          //body('type', 'not image or video').contains('image'),
          body('type', 'not image or video').matches('(?=video|image)'),
        ],
        mediaController.media_create);



module.exports = router;