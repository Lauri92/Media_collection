'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {validationResult} = require('express-validator');
const userModel = require('../Models/userModel');
const bcrypt = require('bcryptjs');

// Handle login
const login = (req, res) => {
  console.log(`authController login req.body: `, req.body);
  passport.authenticate('local', {session: false}, (err, user, info) => {
    console.log('authController authenticate', user);
    if (err || !user) {
      return res.status(400).json({
        message: 'Incorrect credentials',
        user: user,
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // Generate a signed json web token with the contents of user object and return it in the response
      // expiry time could be added too but for now the tokens exist as long as the web page is open
      const token = jwt.sign(user, process.env.JWT/*, { expiresIn: 60 * 5 }*/);
      return res.json({user, token});
    });
  })(req, res);
};

// For creating user
const user_create_post = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  try {
    // Check for email availability, if email is already in database don't allow creation
    // undefined = email isn't taken
    const status = await userModel.checkEmailAvailability(req);

    const available = status === undefined ? true : false;

    if (available) {
      // Email was available
      // Check for errors in input
      if (!errors.isEmpty()) {
        // Errors in validation
        console.log('user create error', errors);
        res.send(errors.array());
      } else {
        // No errors
        // bcrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        // Admin always defaults to 0, for now only manual SQL query on server / myphpadmin to set admins
        req.body.admin = 0;

        // Insert placeholder image as profile pic
        req.body.profile_picture = 'portrait_placeholder.png'

        console.log('authController: salt and hash created, pw hashed');

        if (await userModel.insertUser(req)) {
          res.status(200).json({message: 'Registration succesfull and account created'})
        } else {
          res.status(400).json({message: 'register error'});
        }
      }
    } else {
      // Email wasn't available
      res.json({message: 'Email is already taken'});
    }
  } catch (e) {
    console.error(e.message);
  }
};

// Handle logout
const logout = (req, res) => {
  // Removes req.user
  // Redirects to index.html
  req.logout();

  res.json({message: 'You have logged out'});
};

module.exports = {
  login,
  logout,
  user_create_post,
};