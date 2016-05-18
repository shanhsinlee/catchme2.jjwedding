'use strict';

var _database = require('../utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _models = require('../utils/models.js');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var game1result = function game1result(res) {
  _models2.default.fetchAllUserData().then(function (userData) {
    var rank = userData.sort(function (a, b) {
      return +a.hit < +b.hit;
    });
    rank = rank.slice(0, 10).map(function (user) {
      var value = {
        name: user.name,
        score: user.hit,
        uid: user.uid
      };
      return value;
    });
    return res.status(200).json(rank);
  }).catch(function (reason) {
    return res.status(400).json({ msg: reason });
  });
};

var game2result = function game2result(res) {
  _models2.default.fetchAllUserData().then(function (userData) {
    var rank = userData.sort(function (a, b) {
      return +a.shake < +b.shake;
    });
    rank = rank.slice(0, 10).map(function (user) {
      var value = {
        name: user.name,
        score: user.shake,
        uid: user.uid
      };
      return value;
    });
    return res.status(200).json(rank);
  }).catch(function (reason) {
    return res.status(400).json({ msg: reason });
  });
};

var game3result = function game3result(res) {
  new Promise(function (resolve, reject) {
    _models2.default.fetchGame3Result(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }).then(function (result) {
    var jsonData = result.map(function (item) {
      var bits = item.split("|");
      return { name: bits[1] };
    });
    return res.status(200).json(jsonData);
  }).catch(function (reason) {
    return res.status(400).json({ msg: reason });
  });
};

module.exports = function (req, res) {
  switch (req.params.game) {
    case "game1":
      game1result(res);
      break;
    case "game2":
      game2result(res);
      break;
    case "game3":
      game3result(res);
      break;
    default:
      return res.status(400).json({ msg: "錯誤的參數" });
  }
};