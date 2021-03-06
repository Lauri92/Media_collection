'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./Utils/pass');
const rootRoute = require('./Routes/rootRoute');
const profileRoute = require('./Routes/profileRoute');
const mediaRoute = require('./Routes/mediaRoute');
const userRoute = require('./Routes/userRoute');
const authRoute = require('./Routes/authRoute');
const likeRoute = require('./Routes/likeRoute');
const commentRoute = require('./Routes/commentRoute');
const hashtagRoute = require('./Routes/hashtagRoute');
const app = express();

app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));

//Serve static files from root.
app.use(express.static('.'));

// Check where the app is launched
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./production')(app, process.env.PORT);
  console.log('App started on production server');
} else {
  require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
  console.log('App started on localhost.');
}

app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/media', mediaRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/profile', passport.authenticate('jwt', {session: false}),
    profileRoute);
app.use('/likes', likeRoute);
app.use('/comments', commentRoute);
app.use('/hashtags', hashtagRoute);


