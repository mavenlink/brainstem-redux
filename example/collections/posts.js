const { Collection } = require('brainstem-js');
const Post = require('../models/post').default;

export default Collection.extend({
  model: Post,
  url: '/api/v1/posts',
});
