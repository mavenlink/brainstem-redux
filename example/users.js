const { Collection } = require('brainstem-js');
const User = require('./user');

module.exports = Collection.extend({
  model: User,
  url: '/api/v1/users'
});
