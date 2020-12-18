'use strict';
const {ExifImage} = require('exif');

// Check if there is any exifdata in an image
const checkExifdata = (imgFile) => { // imgFile = full path to uploaded image
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({image: imgFile}, function(error, exifData) {
        console.log('exifData before error', exifData);
        if (exifData === undefined) {
          const hasExifData = false;
          resolve(hasExifData);
        } else {
          const hasExifData = true;
          resolve(hasExifData);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Get coordinates if they are in the exifdata
const getCoordinates = (imgFile) => { // imgFile = full path to uploaded image
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({image: imgFile}, function(error, exifData) {
        if (error) {
          console.log('Error: ' + error.message);
          reject(error);
        } else {
          console.log('Exif data', exifData); // Do something with your data!
          //Check if there are gps info in the pic
          if (exifData.gps.GPSLongitude !== undefined) {
            const coordinates = [
              gpsToDecimal(exifData.gps.GPSLongitude,
                  exifData.gps.GPSLongitudeRef),
              gpsToDecimal(exifData.gps.GPSLatitude,
                  exifData.gps.GPSLatitudeRef),
            ];
            resolve(coordinates);
          } else {
            const coordinates = null;
            resolve(coordinates);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// convert GPS coordinates to decimal format
// for longitude, send exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef
// for latitude, send exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef
const gpsToDecimal = (gpsData, hem) => {
  let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
      parseFloat(gpsData[2] / 3600);
  return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};

// Get original photo taken time
const getDateTimeOriginal = (imgFile) => { // imgFile = full path to uploaded image
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({image: imgFile}, function(error, exifData) {
        if (error) {
          console.log('Error: ' + error.message);
          reject(error);
        } else {
          console.log('Exif data', exifData); // Do something with your data!
          //Check if the image has datetime
          let dateTimeOriginal;
          if (exifData.exif.DateTimeOriginal === undefined) {
            dateTimeOriginal = null;
          } else {
            dateTimeOriginal = exifData.exif.DateTimeOriginal;
          }
          resolve(dateTimeOriginal);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getCoordinates,
  getDateTimeOriginal,
  checkExifdata
};
