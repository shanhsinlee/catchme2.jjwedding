'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _database = require('./utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _handlers = require('./handlers');

var _handlers2 = _interopRequireDefault(_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 5566;
var app = (0, _express2.default)();

// middlewares

// to support JSON-encoded bodies
app.use(_bodyParser2.default.json());

// to support URL-encoded bodies
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

var isUidValid = function isUidValid(req, res, next) {
  // check uid
  _database2.default.exists('user:' + req.params.uid, function (err, exists) {
    if (exists) {
      return next();
    } else {
      // failed
      return res.json({ code: 0, msg: "失敗 (uid 不存在)" });
    }
  });
};

// routes
app.get('/', _handlers2.default.index);
app.post('/login', _handlers2.default.login);
app.post('/user/:uid/submit', isUidValid, _handlers2.default.submit);
app.get('/user/:uid/score', isUidValid, _handlers2.default.score);
app.get('/user/:uid', _handlers2.default.user);

app.listen(PORT, function () {
  console.log('listening on port ' + PORT + '...');
});