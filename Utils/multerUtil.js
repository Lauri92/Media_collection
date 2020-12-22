'use strict';

// Functions to check type of uploaded data

// Prevent multer for saving wrong file types, allow images and videos for media content
const mediaFileFilter = (req, file, cb) => {
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

// Prevent multer for saving wrong file types, allow images for profile pictures
const imageFileFilter = (req, file, cb) => {
  console.log(`fileFilter file: ${file.mimetype}`);
  // Only accept images and videos
  try {
    if (file.mimetype.includes('image')) {
      return cb(null, true);
    } else {
      return cb(null, false, new Error('not an image'));
    }
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  mediaFileFilter,
  imageFileFilter
};