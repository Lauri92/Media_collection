'use strict';
//userRoute
const express = require('express');
const {body} = require('express-validator');
const userController = require('../Controllers/userController');
const router = express.Router();

// Get users
router.get('/', userController.user_list_get);

// Get user by id
router.get('/:id', userController.user_get_by_id);

// Get currently logged user
router.get('/check/userlogged', userController.check_username);

module.exports = router;