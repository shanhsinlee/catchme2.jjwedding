"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  _database2.default.hgetall("user:" + req.params.uid, function (err, result) {
    if (result == null) {
      return res.status(400).json({ msg: "失敗 (查詢失敗)" });
    } else {
      return res.status(200).json(result);
    }
  });
};