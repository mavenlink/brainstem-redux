const { Model } = require('brainstem-js');

module.exports = Model.extend({
  paramRoot: 'user',
  brainstemKey: 'users',
  urlRoot: '/api/v1/users',
});
