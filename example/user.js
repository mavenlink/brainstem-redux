const { BrainstemModel } = require('brainstem-js');

module.exports = BrainstemModel.extend({
  paramRoot: 'user',
  brainstemKey: 'users',
  urlRoot: '/api/v1/users'
});
