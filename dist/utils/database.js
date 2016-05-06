'use strict';

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(process.cwd() + "/config.yml", 'utf8'));

module.exports = _redis2.default.createClient(config.redisPort, config.redisHost);