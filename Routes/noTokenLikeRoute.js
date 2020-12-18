'use strict';
//likeRoute for not logged user
const express = require('express');
const likeController = require('../Controllers/likeController');
const router = express.Router();

// Only get for non logged in users
router.get('/:id', likeController.get_likes_by_id);

module.exports = router;