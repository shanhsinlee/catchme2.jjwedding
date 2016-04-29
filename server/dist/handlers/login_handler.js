'use strict';

var _database = require('../utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var name = req.body.name;
  var captcha = req.body.captcha;
  var isValid = true;

  // TODO check captcha valid
  var checkCaptcha = function checkCaptcha(c) {
    return true;
  };

  if (!name || !captcha || checkCaptcha(captcha)) {
    isValid = false;
  }

  var uid = _nodeUuid2.default.v4().split('-').join('');

  _database2.default.hmset('user:' + uid, "name", name, "shake", "0", "hit", "0", "connected", "false", function (err) {
    if (err) {
      return res.json({ code: 0, msg: "失敗 (更新失敗)" });
    } else {
      return res.json({ code: 1, msg: "成功", uid: uid, name: name });
    }
  });
};