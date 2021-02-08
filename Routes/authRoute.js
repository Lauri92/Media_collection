'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const {body} = require('express-validator');
const english = require('naughty-words/en.json');

// log in a user
router.post('/login', authController.login);

// log out a user
router.get('/logout', authController.logout);

// register a user
/*
router.post('/register',
    [
      body('name', 'minimum length 3 characters and not a naughty word!').isLength({min: 3}).not().isIn(english),
      body('lastname', 'minimum length 3 characters and not a naughty word!').isLength({min: 3}).not().isIn(english),
      body('email', 'is not valid email').isEmail(),
      body('password',
          'minimum length 8 characters, at least one capital letter').
          matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post
);
 */

module.exports = router;