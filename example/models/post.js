const { Model } = require('brainstem-js');

module.exports = Model.extend({
  paramRoot: 'post',
  brainstemKey: 'posts',
  urlRoot: '/api/v1/posts'
});
