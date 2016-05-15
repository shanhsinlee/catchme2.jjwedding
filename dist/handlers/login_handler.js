'use strict';

var _database = require('../utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var name = req.body.name;

  if (!name) {
    return res.status(400).json({ msg: "未提供名字!" });
  }

  var uid = _nodeUuid2.default.v4().split('-').join('');

  _database2.default.hmset('user:' + uid, "name", name, "shake", "0", "hit", "0", "energy", "", function (err) {
    if (err) {
      return res.status(400).json({ msg: "失敗 (更新失敗)" });
    } else {
      return res.status(200).json({ msg: "成功", uid: uid, name: name });
    }
  });
};