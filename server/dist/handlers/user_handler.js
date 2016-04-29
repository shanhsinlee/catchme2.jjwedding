"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var resp = function resp(result) {
    if (result == null) {
      return res.json({ code: 0, msg: "失敗 (查詢失敗)" });
    } else {
      return res.json(result);
    }
  };

  _database2.default.hgetall("user:" + req.params.uid, function (err, obj) {
    resp(obj);
  });
};