'use strict';

var _database = require('../utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _models = require('../utils/models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game1User = {
  key: "cheat_1",
  name: "宗翰"
};
var game2User = {
  key: "cheat_2",
  name: "幽默大師"
};
var game3User_1 = {
  key: "cheat_3_1",
  name: "飛球"
};
var game3User_2 = {
  key: "cheat_3_2",
  name: "阿達"
};

var setGame1And2 = function setGame1And2(res, uidKey, name, shake, hit) {
  _database2.default.hmset('user:' + uidKey, "name", name, "shake", shake, "hit", hit, "energy", "", function (err) {
    if (err) {
      return res.status(400).json({ error: "Set 失敗 (更新失敗)" });
    } else {
      return res.status(200).json({ msg: "Set 成功" });
    }
  });
};

var resetGame1And2 = function resetGame1And2(res, uidKey) {
  _database2.default.del('user:' + uidKey, function (err) {
    if (err) {
      return res.status(400).json({ error: "Reset 失敗 (更新失敗)" });
    } else {
      return res.status(200).json({ msg: "Reset 成功" });
    }
  });
};

var setGame3 = function setGame3(res) {
  var user1 = game3User_1.key + '|' + game3User_1.name;
  var user2 = game3User_2.key + '|' + game3User_2.name;
  new Promise(function (resolve, reject) {
    _models2.default.fetchGame3Result(function (err, game3ResultList) {
      // 如果裡面有資料再 reset
      var filterData = game3ResultList.filter(function (user) {
        var userName = user.split("|")[1];
        return userName === game3User_1.name || userName === game3User_2.name;
      });

      // 若已有資料，不能多加
      if (filterData.length >= 2) {
        reject("不可設定，已有資料");
      } else {
        resolve();
      }
    });
  }).then(function () {
    return new Promise(function (resolve, reject) {
      _database2.default.lpush("game3_result", user1, function (err) {
        if (err) {
          reject("Set3 失敗 (更新失敗)");
        } else {
          resolve();
        }
      });
    });
  }).then(function () {
    return new Promise(function (resolve, reject) {
      _database2.default.lpush("game3_result", user2, function (err) {
        if (err) {
          reject("Set3 失敗 (更新失敗)");
        } else {
          resolve();
        }
      });
    });
  }).then(function () {
    return res.status(200).json({ msg: "Set3 成功" });
  }).catch(function (reason) {
    return res.status(400).json({ error: reason });
  });
};

var resetGame3 = function resetGame3(res) {
  new Promise(function (resolve, reject) {
    _models2.default.fetchGame3Result(function (err, game3ResultList) {
      // 如果裡面有資料再 reset
      var filterData = game3ResultList.filter(function (user) {
        var userName = user.split("|")[1];
        return userName === game3User_1.name || userName === game3User_2.name;
      });

      // 若有兩個 set 就刪
      if (filterData.length >= 2) {
        resolve();
      } else {
        reject("沒有資料可刪");
      }
    });
  }).then(function () {
    return new Promise(function (resolve, reject) {
      _database2.default.ltrim("game3_result", 2, -1, function (err) {
        if (err) {
          reject("Reset3 失敗 (更新失敗)");
        } else {
          resolve();
        }
      });
    });
  }).then(function (result) {
    return res.status(200).json({ msg: "Reset3 成功" });
  }).catch(function (reason) {
    return res.status(400).json({ error: reason });
  });
};

module.exports = function (req, res) {
  var game = req.params.game;
  var option = req.params.option;
  var data = req.body;

  switch (game) {
    case "game1":
      if (option === "set") {
        var shakeCount = 0;
        var hitCount = 888;
        setGame1And2(res, game1User.key, game1User.name, shakeCount, hitCount);
      } else {
        resetGame1And2(res, game1User.key);
      }
      break;
    case "game2":
      if (option === "set") {
        var _shakeCount = 5566;
        var _hitCount = 0;
        setGame1And2(res, game2User.key, game2User.name, _shakeCount, _hitCount);
      } else {
        resetGame1And2(res, game2User.key);
      }
      break;
    case "game3":
      if (option === "set") {
        setGame3(res);
      } else if (option === "reset") {
        resetGame3(res);
      } else {
        _database2.default.del("game3_result", function (err) {
          if (err) {
            return res.status(400).json({ error: "清除失敗" });
          } else {
            return res.status(200).json({ msg: "成功" });
          }
        });
      }
      break;
  }
};