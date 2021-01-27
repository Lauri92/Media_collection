'use strict';
//userRoute
const express = require('express');
const {body} = require('express-validator');
const userController = require('../Controllers/userController');
const router = express.Router();
const multer = require('multer');
const {imageFileFilter} = require('../Utils/multerUtil');

// Upload image and add size limit
const limits = {fileSize: 20 * 1024 * 1024};  //20MB
const upload = multer({limits: limits, dest: 'Uploads/', imageFileFilter});

const injectFile = (req, res, next) => {
  console.log('injectFile req.file: ', req.file);
  if (req.file) {
    // We can now validate the type of the file with express validator
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

// Get users
router.get('/', userController.user_list_get);

// Get user by id
router.get('/:id', userController.user_get_by_id);

// Get currently logged user
router.get('/check/userlogged', userController.check_username);

// Update profilepic
router.put('/', upload.single('profile-pic'),
    userController.make_thumbnail,
    injectFile,
    [
      body('type', 'not an image').matches('(?=image)'),
    ],
    userController.update_profile_pic,
);

module.exports = router;