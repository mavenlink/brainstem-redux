const { Model } = require('brainstem-js');

const Post = Model.extend({
  paramRoot: 'post',
  brainstemKey: 'posts',
  urlRoot: '/api/v1/posts',
  validate() {
    let isValid;

    if (this.get('title') === undefined) {
      isValid = { errors: 'needs a user' };
    }

    return isValid;
  }
});

module.exports = Post;
