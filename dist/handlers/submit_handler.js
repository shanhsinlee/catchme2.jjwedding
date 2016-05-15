'use strict';

var _database = require('../utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _models = require('../utils/models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (req, res) {
  var action = req.body.action;
  var value = req.body.value || 0;
  var updateKey = "";
  var userData = null;

  // check game switch
  new Promise(function (resolve, reject) {
    _database2.default.hgetall("game_status", function (err, gameStatus) {
      if (err) {
        reject("查詢遊戲開關錯誤");
      } else {
        switch (action) {
          // 關卡一
          case "hit":
            if (gameStatus.game1 !== "on") {
              reject("遊戲尚未開始");
            } else {
              updateKey = "hit";
              resolve(true);
            }
            break;
          // 關卡二
          case "shake":
            if (gameStatus.game2 !== "on") {
              reject("遊戲尚未開始");
            } else {
              updateKey = "shake";
              resolve(true);
            }
            break;
          // 關卡三
          case "energy":
            if (gameStatus.game3 !== "on") {
              reject("遊戲尚未開始");
            } else {
              updateKey = "energy";
              resolve(true);
            }
            break;
          default:
            // invalid action
            reject("失敗 (未提供 action params)");
            break;
        }
      }
    });
  }).then(function (success) {
    // 查詢使用者遊戲分數
    return new Promise(function (resolve, reject) {
      _database2.default.hgetall('user:' + req.params.uid, function (err, result) {
        if (err) {
          reject("失敗 (查詢分數失敗)");
        } else {
          userData = result;
          resolve(userData[updateKey]);
        }
      });
    });
  }).then(function (score) {
    return new Promise(function (resolve, reject) {
      var scoreToWrite = 0;

      switch (action) {
        case "hit":
          // 遊戲一直接將總和寫入
          scoreToWrite = +value;
          break;
        case "shake":
          // 遊戲二是 append 分數
          scoreToWrite = +score + +value;
          break;
        case "energy":
          // 遊戲三只要將名單記到某個 list 就行，並將 user 的 energy 資料改成 "0"
          scoreToWrite = 0;
          _models2.default.writeGame3Result({ name: userData.name, uid: req.params.uid });
          break;
        default:
          break;
      }

      _database2.default.hmset('user:' + req.params.uid, updateKey, scoreToWrite, function (err) {
        if (err) {
          reject("失敗 (更新失敗)");
        } else {
          resolve(scoreToWrite);
        }
      });
    });
  }).then(function (score) {
    var jsonData = { name: userData.name };
    jsonData[updateKey] = score;
    return res.status(200).json(jsonData);
  }).catch(function (reason) {
    return res.status(400).json({ msg: reason });
  });
};