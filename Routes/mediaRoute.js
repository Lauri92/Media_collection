'use strict';
const express = require('express');
const mediaController = require('../Controllers/mediaController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');
const english = require('naughty-words/en.json');
const passport = require('../Utils/pass');
const {mediaFileFilter} = require('../Utils/multerUtil');

// Upload image and add size limit
const limits = {fileSize: 20 * 1024 * 1024};  //10MB
const upload = multer({
  limits: limits, dest: 'Uploads/', onError: function(err, next) {
    console.log('error', err);
    next(err);
  }, mediaFileFilter,
});

const injectFile = (req, res, next) => {
  console.log('injectFile req.file: ', req.file);
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

// Get all media count
router.get('/count', passport.authenticate('jwt', {session: false}),
    mediaController.media_count_get);

// Get all media
router.get('/media', passport.authenticate('jwt', {session: false}),
    mediaController.media_list_get);

// Get scrolling media recent -> rows of 6
router.get('/scroll/:limit1/:limit2',
    passport.authenticate('jwt', {session: false}),
    mediaController.media_scroll_list_get);

// Get scrolling media likes -> rows of 6
router.get('/scrolllikes/:limit1/:limit2',
    mediaController.media_scroll_list_get_likes);

// Get all images
router.get('/pics', passport.authenticate('jwt', {session: false}),
    mediaController.pic_list_get);

// Get all videos
router.get('/videos', passport.authenticate('jwt', {session: false}),
    mediaController.video_list_get);

// Get all media of user
router.route('/usermedia').
    get(passport.authenticate('jwt', {session: false}),
        mediaController.media_get_by_owner);

// Get specified media of user
router.route('/specifiedusermedia/video').
    get(passport.authenticate('jwt', {session: false}),
        mediaController.chosen_media_get_by_owner);
router.route('/specifiedusermedia/image').
    get(passport.authenticate('jwt', {session: false}),
        mediaController.chosen_media_get_by_owner);

// Get specified media count of user (how many images or videos the user has)
router.route('/specifiedusermediacount/video').
    get(passport.authenticate('jwt', {session: false}),
        mediaController.chosen_media_count_get_by_owner);
router.route('/specifiedusermediacount/image').
    get(passport.authenticate('jwt', {session: false}),
        mediaController.chosen_media_count_get_by_owner);

// Order all media by most likes
router.get('/mostlikes', mediaController.media_list_get_by_most_likes);

// Order all media by search input, search descriptions or tags
router.get('/search/descriptions/:input',
    mediaController.media_list_get_by_search);
router.get('/search/tags/:input', mediaController.media_list_get_by_search);

// Get logged in users media by id
router.get('/picuserid/:media_id',
    passport.authenticate('jwt', {session: false}),
    mediaController.get_media_user_id);

// Delete media of user
router.delete('/delete/:media_id',
    passport.authenticate('jwt', {session: false}),
    mediaController.media_delete);

// Upload media
router.route('/').post(passport.authenticate('jwt', {session: false}),
    upload.single('media'),
    mediaController.make_thumbnail,
    injectFile,
    [
      body('description',
          'must be at least three characters long and not contain bad words!').
          isLength({min: 3}).not().isIn(english),
      //body('type', 'not image or video').contains('image'),
      body('type', 'not image or video').matches('(?=video|image)'),
    ],
    mediaController.media_create);

module.exports = router;