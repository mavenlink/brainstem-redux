const { BrainstemCollection } = require('brainstem-js');
const User = require('./user');

BrainstemCollection.extend({
  model: User,
  url: '/api/v1/users'
});
