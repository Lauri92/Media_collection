'use strict';
//User controller
const userModel = require('../Models/userModel');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../Utils/resize');
const fs = require('fs');

// Create thumbnail for profile picture with sharp --> resize.js
const make_thumbnail = async (req, res, next) => {
  console.log('make_thumbnail req.file.mimetype: ', req.file.mimetype);
  try {
    const ready = await makeThumbnail({width: 800, height: 800},
        req.file.path,
        './Profilepics/' + req.file.filename);
    if (ready) {
      console.log('make_thumbnail', ready);
      next();
    }
  } catch (e) {
    //return res.status(400).json({errors: e.message});
    next();
  }
};

// Update profile picture
const update_profile_pic = async (req, res) => {
  console.log('req.file: ', req.file);

  // Check if validation was passed without errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Error happened in pic validation: ', errors.array());

    // Delete the pic which is tried to be uploaded
    fs.unlink(`Profilepics/${req.file.filename}`, err => {
      if (err) throw err;
      console.log(
          `Removing Profilepics/${req.file.filename} because of error in validation.`);
    });
    // Return encountered errors to user
    return res.status(400).json({errors: errors.array()});
  }

  //Add jwt user_id as part of body
  req.body.id = req.user.id;

  // Delete Uploaded file from machine if it is image, only Thumbnails and Profilepics are used, Videos stay in Uploads
  try {
    fs.unlink(`Uploads/${req.file.filename}`, err => {
      if (err) throw err;
      console.log(`Removing Uploads/${req.file.filename}`);
    });
    // Also delete old profile picture unless it is placeholder image, which is default for all new users
    const oldProfilePic = await userModel.getUser(req.user.id);
    if (oldProfilePic.profile_picture !== 'portrait_placeholder.png') {
      fs.unlink(`Profilepics/${oldProfilePic.profile_picture}`, err => {
        if (err) throw err;
        console.log(`Removing Profilepics/${oldProfilePic.profile_picture}`);
      });
    }
  } catch (e) {
    console.log(e.message);
  }

  // Inser new profile picture
  const updated = await userModel.updateProfilePic(req);
  res.json(updated);
};

// Get all users
const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  await res.json(users);
};

// Get user by id
const user_get_by_id = async (req, res) => {
  console.log(`userRoute: http get user with path param`, req.params);
  const user = await userModel.getUser(req.params.id);
  await res.json(user);
};

// Create a user, this one isn't used
const user_create = async (req, res) => {
  console.log('userController user_create: ', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  await userModel.insertUser(req);
  //const user = await userModel.getUser(id);
  //res.send(user);
};

// Simple check to check for who is the jwt holder
const check_username = async (req, res) => {
  // No returning of JWT values because updated profile pic value wouldn't be included
  const user = await userModel.getUser(req.user.id);
  await res.json(user);
};

module.exports = {
  user_list_get,
  user_get_by_id,
  user_create,
  check_username,
  make_thumbnail,
  update_profile_pic,
};