'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require('../Models/userModel');
const bcrypt = require('bcryptjs');

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        console.log('Local strategy', user); // result is binary row
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect email.'});
        }
        const isSync = await (!bcrypt.compareSync(password, user.password))
        if (isSync) {
          return done(null, false, {message: 'Incorrect credentials.'});
        }
        return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
      } catch (err) {
        return done(err);
      }
    }));


// Check token
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT,
    },
    async (jwtPayLoad, done) => {
      try {
        //console.log('util pass JWT', jwtPayLoad);
        if (jwtPayLoad === undefined) {
          return done(null, false, {message: 'Incorrect id.'});
        }
        return done(null, {...jwtPayLoad}, {message: 'Logged in succesfully 😀'})
      } catch (err) {
        return done(err);
      }
    },
));


module.exports = passport;