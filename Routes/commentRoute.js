'use strict';
//commentRoute
const express = require('express');
const commentController = require('../Controllers/commentController');
const passport = require('../Utils/pass');
const {body} = require('express-validator');
const english = require('naughty-words/en.json');
const router = express.Router();

// get comments of media
router.get('/:id', commentController.get_comments_by_pic_id);

// for checking owner of a comment
router.get('/commentuserid/:comment_id', commentController.get_comment_user_id);

// delete own comment or admin delete
router.delete('/delete/:comment_id',
    passport.authenticate('jwt', {session: false}),
    commentController.comment_delete);

// comment a piece media
router.post('/:media_id', passport.authenticate('jwt', {session: false}),
    [
      body('comment',
          'must be at least three characters').
          isLength({min: 3}).not().contains(english),
      //isLength({min: 3}).not().isIn(['ass', '123', 'god']),
    ],
    commentController.add_comment);

module.exports = router;