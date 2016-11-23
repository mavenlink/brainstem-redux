const { Model } = require('brainstem-js');

module.exports = Model.extend({
  paramRoot: 'post',
  brainstemKey: 'posts',
  urlRoot: '/api/v1/posts',
  validate: () => {
    // why does `this` compile to undefined???
    if (this.get('user_id') === undefined) {
      return false;
    }
  }
});

module.exports = Post;
