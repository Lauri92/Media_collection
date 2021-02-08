'use strict';
//likeRoute
const express = require('express');
const likeController = require('../Controllers/likeController');
const passport = require('../Utils/pass');
const router = express.Router();

// Get likes and dislikes of media
router.get('/:id', passport.authenticate('jwt', {session: false}),
    likeController.get_likes_by_id);

// Post a like
router.post('/incrementlike/:id',
    passport.authenticate('jwt', {session: false}),
    likeController.create_user_like);

// Post a dislike
router.post('/incrementdislike/:id',
    passport.authenticate('jwt', {session: false}),
    likeController.create_user_like);

// Get status if user has liked yet or not
router.get('/likestatus/:media_id',
    passport.authenticate('jwt', {session: false}),
    likeController.like_status);

module.exports = router;