const { Collection } = require('brainstem-js');
const User = require('../models/user').default;

export default Collection.extend({
  model: User,
  url: '/api/v1/users',
});
