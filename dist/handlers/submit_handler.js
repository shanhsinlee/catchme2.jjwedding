"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var action = req.body.action;
  var value = req.body.value || 0;
  var updateKey = "";

  if (action === "hit") {
    updateKey = "hit";
  } else if (action === "shake") {
    updateKey = "shake";
  } else {
    // invalid action
    return res.status(400).json({ msg: "失敗 (未提供 action params)" });
  }

  var getUserScore = new Promise(function (resolve, reject) {
    _database2.default.hget("user:" + req.params.uid, updateKey, function (err, score) {
      if (err) {
        reject("失敗 (查詢分數失敗)");
      } else {
        resolve(score);
      }
    });
  });

  getUserScore.then(function (score) {
    return new Promise(function (resolve, reject) {
      var scoreToWrite = +score + +value;
      _database2.default.hmset("user:" + req.params.uid, updateKey, scoreToWrite, function (err) {
        if (err) {
          reject("失敗 (更新失敗)");
        } else {
          resolve(scoreToWrite);
        }
      });
    });
  }).then(function (score) {
    return res.status(200).json({ msg: "成功", action: updateKey, score: score });
  }).catch(function (reason) {
    res.status(400).json({ msg: msg });
  });
};