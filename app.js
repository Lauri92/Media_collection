'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./Utils/pass');
const rootRoute = require('./Routes/rootRoute');
const picRoute = require('./Routes/picRoute');
const userRoute = require('./Routes/userRoute');
const authRoute = require('./Routes/authRoute');
const likeRoute = require('./Routes/likeRoute');
const noTokenLikeRoute = require('./Routes/noTokenLikeRoute');
const commentRoute = require('./Routes/commentRoute');
const app = express();


app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));

//Serve static files from root.
app.use(express.static('.'));

//Serve static files from uploads.
//app.use(express.static('Uploads')); //serve static files for images

//Serve static files from thumbnails.
app.use('/Thumbnails', express.static('Thumbnails'));

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./production')(app, process.env.PORT);
} else {
  require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
}

app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/notokenpic', picRoute);
app.use('/notokenlikes', noTokenLikeRoute);
app.use('/notokencomments', commentRoute);
app.use('/pic', passport.authenticate('jwt', {session: false}), picRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/likes', passport.authenticate('jwt', {session: false}), likeRoute);
app.use('/comments', passport.authenticate('jwt', {session: false}),
    commentRoute);

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

