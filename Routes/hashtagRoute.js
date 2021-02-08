'use strict';
//userRoute
const express = require('express');
const hashtagController = require('../Controllers/hashtagController');
const passport = require('../Utils/pass');
const router = express.Router();

router.get('/:media_id', passport.authenticate('jwt', {session: false}),
    hashtagController.hashtag_list_get);

module.exports = router;