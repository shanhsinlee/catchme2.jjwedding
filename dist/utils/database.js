'use strict';

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../configs/config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _redis2.default.createClient(_config2.default.redisPort, _config2.default.redisHost);