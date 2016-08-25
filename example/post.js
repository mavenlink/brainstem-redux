const { BrainstemModel } = require('brainstem-js');

module.exports = BrainstemModel.extend({
  paramRoot: 'post',
  brainstemKey: 'posts',
  urlRoot: '/api/v1/posts'
});
