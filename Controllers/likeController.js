'use strict';
const likeModel = require('../Models/likeModel');

// Uses media ID
const get_likes_by_id = async (req, res) => {
  //console.log(`likeController: get_likes_by_id with path param`, req.params);
  const like = await likeModel.getLikesById(req.params.id);
  await res.json(like);
};

// Create like or dislike for user for a media
const create_user_like = async (req, res) => {
  try {
    // Backend check that a user cannot post multiple likes in any possible way
    req.body.media_id = req.params.id;
    req.body.user_id = req.user.id;

    // Get status whether user has liked yet or not
    const status = await likeModel.likeStatus(req);
    console.log('likeController: like_status', status);

    // User hasn't liked or disliked before
    // undefined in this case means that database has no record with combined user_id and media_id
    // req.path contains the info which determines which button was pressed
    if (status === undefined) {
      // User clicked like button
      if (req.path.includes('incrementlike')) {
        req.body.likes = 1;
        req.body.dislikes = 0;
      } else {
        // User clicked dislike button
        req.body.dislikes = 1;
        req.body.likes = 0;
      }
      console.log(req.body);

      //
      const updatedLike = await likeModel.createUserLike(req);
      await res.json(updatedLike);
    } else {
      console.log('User has already liked');
      res.send('response: Already liked');
    }
  } catch (e) {
    console.error(e.message);
  }
};


// Check if the user has liked or disliked the picture or not
const like_status = async (req, res) => {
  try {
    req.body.media_id = req.params.media_id;
    req.body.user_id = req.user.id;
    const status = await likeModel.likeStatus(req);
    //console.log('likeController: like_status', status);


    if (status == undefined) {
      // User hasn't liked
      await res.status(200).send({'result': false});
    } else if (status.likes == 1 || status.dislikes == 1) {
      // User has liked or disliked already
      await res.status(200).send({'result': true});
    } else {
      // User hasn't liked
      await res.status(200).send({'result': false});
    }
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  get_likes_by_id,
  create_user_like,
  like_status,
};