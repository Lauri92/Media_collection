'use strict';
//root routes (example with get, post and put)
const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/profile', (req, res) => {
  console.log('profileRoute: root route with req:', req.query);
  //res.send(`<h1>Hello profile page</h1>`);
  res.sendFile(path.join(__dirname+'/profilePage.html'));
  console.log(__dirname);
});

// No use
router.post('/', (req, res) => {
  console.log('profileRoute: / route with post', req.body);
  res.send('Hello root route with http post');
});

// No use
router.put('/', (req, res) => {
  console.log('profileRoute: http put');
  res.send('http put on root route');
});

// No use
router.delete('/', (req, res) => {
  console.log('profileRoute: http delete');
  res.send('http delete on root route');
});

module.exports = router;