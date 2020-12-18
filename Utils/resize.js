'use strict';
const sharp = require('sharp');

const makeThumbnail = async (size, file, thumbname) => {
  console.log('resize, resizing: ', file);
  //size is entered as an object: {width: X, height: Y}
  // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  console.log('makeThumbnail', file, thumbname);
  const thumbnail = await sharp(file).
      resize(size.width, size.height).
      toFile(thumbname);
  return thumbnail;
};

module.exports = {
  makeThumbnail,
};