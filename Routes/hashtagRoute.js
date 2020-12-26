'use strict';
//userRoute
const express = require('express');
const hashtagController = require('../Controllers/hashtagController');
const router = express.Router();



router.get('/:media_id', hashtagController.hashtag_list_get);

module.exports = router;