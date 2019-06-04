const { Model } = require('brainstem-js');

export default Model.extend({
  paramRoot: 'user',
  brainstemKey: 'users',
  urlRoot: '/api/v1/users',
});
