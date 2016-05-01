'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _fileStreamRotator = require('file-stream-rotator');

var _fileStreamRotator2 = _interopRequireDefault(_fileStreamRotator);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _database = require('./utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _handlers = require('./handlers');

var _handlers2 = _interopRequireDefault(_handlers);

var _config = require('./configs/config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// predefine
var PORT = _config2.default.serverPort;
var app = (0, _express2.default)();

// HTTP request logger middleware
var logger = (0, _morgan2.default)('combined');
var logDirectory = __dirname + '/logs';

// ensure log directory exists
_fs2.default.existsSync(logDirectory) || _fs2.default.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = _fileStreamRotator2.default.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

// setup the logger
app.use((0, _morgan2.default)('combined', { stream: accessLogStream }));

// gzip
app.use((0, _compression2.default)());
// to support JSON-encoded bodies
app.use(_bodyParser2.default.json());
// to support URL-encoded bodies
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

// check uid
var isUidValid = function isUidValid(req, res, next) {
  // check uid
  _database2.default.exists('user:' + req.params.uid, function (err, exists) {
    if (exists) {
      return next();
    } else {
      // failed
      return res.status(400).json({ msg: "失敗 (uid 不存在)" });
    }
  });
};

// routes
app.get('/', _handlers2.default.index);
app.post('/login', _handlers2.default.login);
app.post('/user/:uid/submit', isUidValid, _handlers2.default.submit);
app.get('/user/:uid/score', isUidValid, _handlers2.default.score);
app.get('/user/:uid', _handlers2.default.user);

// htmls
// app.use('/css', express.static(__dirname + '../../web/css'))
// app.use('/images', express.static(__dirname + '../../web/images'))
// app.use('/img', express.static(__dirname + '../../web/img'))
// app.use('/js', express.static(__dirname + '../../web/js'))

app.listen(PORT, function () {
  console.log(process.env.NODE_ENV);
  console.log('listening on port ' + PORT + '...');
});