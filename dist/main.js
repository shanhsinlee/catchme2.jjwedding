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

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _database = require('./utils/database.js');

var _database2 = _interopRequireDefault(_database);

var _handlers = require('./handlers');

var _handlers2 = _interopRequireDefault(_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// predefine
var appDir = _path2.default.dirname(require.main.filename);
var config = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(appDir + '/../config.yml', 'utf8'));
var PORT = config.serverPort;
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

// check game server status for game1, game2, game3
var isGameOn = function isGameOn(req, res, next) {
  var key = req.path.split("/")[1];
  _database2.default.hget("game_status", key, function (err, gameStatus) {
    if (err) {
      return res.status(400).json(gameStatus);
    } else if (gameStatus === "off") {
      return res.redirect('/list');
    } else {
      next();
    }
  });
};

// admin
var isAdmin = function isAdmin(req, res, next) {
  var credentials = (0, _basicAuth2.default)(req);

  if (!credentials || credentials.name !== config.adminBasicAuthName || credentials.pass !== config.adminBasicAuthPassword) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="jjwedding"');
    res.end('Access denied!');
  } else {
    return next();
  }
};

// 設定各個遊戲的開關 (有資料的話就不重設了)
_database2.default.exists("game_status", function (err, isKeyExisted) {
  if (!isKeyExisted) {
    console.log("game_status does not exist, create one.");
    _database2.default.hmset("game_status", ["game1", "off", "game2", "off", "game3", "off"], function (err, obj) {
      if (err) throw err;
    });
  }
  console.log("game_status exists, skip.");
});

// assets
app.use('/css', _express2.default.static(__dirname + '/../public/css'));
app.use('/images', _express2.default.static(__dirname + '/../public/images'));
app.use('/img', _express2.default.static(__dirname + '/../public/img'));
app.use('/js', _express2.default.static(__dirname + '/../public/js'));

// htmls
app.get('/', function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/login.html'));
});
app.get('/list', function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/list.html'));
});
app.get('/game1', isGameOn, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game1.html'));
});
app.get('/game2', isGameOn, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game2.html'));
});
app.get('/game3', isGameOn, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game3.html'));
});

// server pages
app.get('/game1s', isAdmin, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game1s.html'));
});
app.get('/game2s', isAdmin, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game2s.html'));
});
app.get('/game3s', isAdmin, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/game3s.html'));
});

// api routes
app.post('/login', _handlers2.default.login);
app.post('/user/:uid/submit', isUidValid, _handlers2.default.submit);
app.get('/user/:uid/score', isUidValid, _handlers2.default.score);
app.get('/user/:uid', _handlers2.default.user);

// 開關遊戲 (是否接收遊戲 api 資料更新)
app.post('/toggle/:game', _handlers2.default.gameswitch);
// 查詢各遊戲 rank
app.get('/rank/:game', _handlers2.default.rank);

// backdoor
var checkTokenAndParams = function checkTokenAndParams(req, res, next) {
  var game = req.params.game;
  var option = req.params.option;
  var isKeyValid = req.params.key === "55665566";
  var isGameParamsValid = ["game1", "game2", "game3"].indexOf(game) > -1;
  var isOptionParamsValid = ["set", "reset", "clear"].indexOf(option) > -1;

  if (isKeyValid && isGameParamsValid && isOptionParamsValid) {
    next();
  } else {
    res.status(400).json({
      error: 'key or params invalid: isKeyValid = ' + isKeyValid + ', isGameParamsValid = ' + isGameParamsValid + ', isOptionParamsValid = ' + isOptionParamsValid
    });
  }
};
app.post('/hack/:key/game/:game/option/:option', checkTokenAndParams, _handlers2.default.backdoor);
app.get('/hackggjj', isAdmin, function (req, res) {
  res.sendFile(_path2.default.join(__dirname + '/../public/hack.html'));
});

app.listen(PORT, function () {
  console.log(process.env.NODE_ENV);
  console.log('listening on port ' + PORT + '...');
});