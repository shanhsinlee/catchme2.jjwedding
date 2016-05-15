"use strict";

var _database = require("../utils/database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var gameName = req.params.game;

  var getGameSwitchStatus = new Promise(function (resolve, reject) {
    _database2.default.hget("game_status", gameName, function (err, status) {
      // 沒這個 key 或狀態的話
      if (status === null) {
        reject("失敗 (查詢遊戲開關狀態失敗)");
      } else {
        resolve(status);
      }
    });
  }).catch(function (reason) {
    res.status(400).json({ msg: reason });
  });

  getGameSwitchStatus.then(function (status) {
    var updateStatus = status === "on" ? "off" : "on";
    return new Promise(function (resolve, reject) {
      _database2.default.hset("game_status", gameName, updateStatus, function (err, obj) {
        if (err) {
          reject("失敗 (設定遊戲開關狀態失敗)");
        } else {
          resolve(updateStatus);
        }
      });
    });
  }).then(function (updateStatus) {
    return res.status(200).json({ game_name: gameName, now_status: updateStatus });
  }).catch(function (reason) {
    res.status(400).json({ msg: reason });
  });
};