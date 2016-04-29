"use strict";

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REDIS_HOST = "localhost";
var REDIS_PORT = 7372;

module.exports = _redis2.default.createClient(REDIS_PORT, REDIS_HOST);