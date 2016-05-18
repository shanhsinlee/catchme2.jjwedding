"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require("./database.js");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var models = function () {
  function models() {
    _classCallCheck(this, models);
  }

  _createClass(models, [{
    key: "writeGame3Result",
    value: function writeGame3Result(userData) {
      var data = userData.uid + "|" + userData.name;
      _database2.default.rpush("game3_result", data, function (err) {});
    }
  }, {
    key: "fetchGame3Result",
    value: function fetchGame3Result(callback) {
      // 只拿前十個
      _database2.default.lrange("game3_result", 0, 9, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    }
  }, {
    key: "fetchAllUserData",
    value: function fetchAllUserData() {
      return new Promise(function (resolve, reject) {
        _database2.default.keys("user:*", function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }).then(function (keys) {
        return new Promise(function (resolve, reject) {
          var multi = _database2.default.multi();
          keys.forEach(function (key) {
            multi.hgetall(key, _database2.default.print);
          });
          multi.exec(function (err, result) {
            if (err) {
              reject(err);
            } else {
              result = result.map(function (item, index) {
                item['uid'] = keys[index].split(":")[1]; // format = user:asdfsafasf131
                return item;
              });
              resolve(result);
            }
          });
        });
      });
    }
  }]);

  return models;
}();

module.exports = new models();