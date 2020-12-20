'use strict';
//likeRoute
const express = require('express');
const likeController = require('../Controllers/likeController');
const router = express.Router();

// Get likes and dislikes of media
router.get('/:id', likeController.get_likes_by_id);

// Post a like
router.post('/incrementlike/:id', likeController.create_user_like);

// Post a dislike
router.post('/incrementdislike/:id', likeController.create_user_like);

// Get status if user has liked yet or not
router.get('/likestatus/:media_id', likeController.like_status);

module.exports = router;