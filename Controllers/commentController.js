'use strict';
const commentModel = require('../Models/commentModel');
const {validationResult} = require('express-validator');

// Get all comments of a media
const get_comments_by_pic_id = async (req, res) => {
  //console.log(`commentController: get_comment_by_id with path param`,
    //  req.params);
  //Query for comment id --> defined in route
  const comment = await commentModel.getCommentsByPicId(req.params.id);
  await res.json(comment);
};

// User add comment
const add_comment = async (req, res) => {
  //console.log(`commentController: add_comment with path param`,
     // req.params);
  //console.log(`commentController: add_comment with body`, req.body);

  // Check for errors in input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Error happened in comment validation: ', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  // Add time of comment post
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];

  //Add values to req.body
  req.body.date = date;
  req.body.media_id = req.params.media_id;
  req.body.user_id = req.user.id;
  //console.log('req.body after adding', req.body);
  const comment = await commentModel.addComment(req);
  await res.json(comment);
};

// Send true if user is the owner of picture, else send false
const get_comment_user_id = async (req, res) => {
  const commentOwner = await commentModel.getCommentUserId(req.params.comment_id);
  if (commentOwner.user_id == req.user.id || req.user.admin == 1) {
    await res.status(200).send({'result': true});
  } else {
    await res.status(200).send({'result': false});
  }
};

// Delete a chosen comment
const comment_delete = async (req, res) => {
  // Check user_id of the comment (=owner), double check so that only user or admin can delete.
  const commentOwner = await commentModel.getCommentUserId(req.params.comment_id);
  //console.log('commentOwner info, is there user_id?: ', commentOwner);

  if (commentOwner.user_id == req.user.id || req.user.admin == 1) {
    const picDeleted = await commentModel.deleteComment(req.params.comment_id);
    await res.json(picDeleted);
  }
};

module.exports = {
  get_comments_by_pic_id,
  add_comment,
  get_comment_user_id,
  comment_delete
};