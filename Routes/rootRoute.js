'use strict';
//root routes (example with get, post and put)
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  console.log('rootRoute: root route with req:', req.query);
  //res.send(`<h1>Hello Index page</h1>`);
  res.render('index.html')
});

// No use
router.post('/', (req, res) => {
  console.log('rootRoute: / route with post', req.body);
  res.send('Hello root route with http post');
});

// No use
router.put('/', (req, res) => {
  console.log('rootRoute: http put');
  res.send('http put on root route');
});

// No use
router.delete('/', (req, res) => {
  console.log('rootRoute: http delete');
  res.send('http delete on root route');
});

module.exports = router;