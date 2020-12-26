'use strict';

const hashtagModel = require('../Models/hashtagModel');

const hashtag_list_get = async (req, res) => {
  console.log('hashtagController hashtag_list_get req.path.params', req.params);
  req.body.id = req.params.media_id;

  const hashtags = await hashtagModel.getAllHashtags(req);

  res.json(hashtags);

};

module.exports = {
  hashtag_list_get
}