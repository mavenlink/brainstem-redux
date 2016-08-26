const { Collection } = require('brainstem-js');
const Post = require('../models/post');

module.exports = Collection.extend({
  model: Post,
  url: '/api/v1/posts'
});