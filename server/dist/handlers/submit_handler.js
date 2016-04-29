"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var action = req.body.action;
  var value = req.body.value || 0; // TODO ask this value is for appending or it's a total number
  var updateKey = "";

  if (action === "hit") {
    updateKey = "hit";
  } else if (action === "shake") {
    updateKey = "shake";
  } else {
    // invalid action
    return res.json({ code: 0, msg: "失敗 (未提供 action params)" });
  }

  _database2.default.hmset("user:" + req.params.uid, updateKey, value, function (err) {
    if (err) {
      return res.json({ code: 0, msg: "失敗 (更新失敗)" });
    } else {
      return res.json({ code: 1, msg: "成功" });
    }
  });
};