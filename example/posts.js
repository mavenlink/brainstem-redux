const { BrainstemCollection } = require('brainstem-js');
const Post = require('./post');

module.exports = BrainstemCollection.extend({
  model: Post,
  url: '/api/v1/posts'
});
