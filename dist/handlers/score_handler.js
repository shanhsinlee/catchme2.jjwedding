"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var action = req.query.action;
  var updateKey = "";

  if (action === "hit") {
    updateKey = "hit";
  } else if (action === "shake") {
    updateKey = "shake";
  } else {
    // invalid action
    return res.status(400).json({ msg: "失敗 (未提供 action params)" });
  }

  _database2.default.hmget("user:" + req.params.uid, "name", updateKey, function (err, reply) {
    if (reply == null) {
      return res.status(400).json({ msg: "失敗 (查詢失敗)" });
    } else {
      var jsonData = { name: reply[0] };
      jsonData[updateKey] = reply[1];
      return res.status(200).json(jsonData);
    }
  });
};