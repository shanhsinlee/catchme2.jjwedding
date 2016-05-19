import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import FileStreamRotator from 'file-stream-rotator'
import basicAuth from 'basic-auth'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

import redis from './utils/database.js'
import handlers from './handlers'

// predefine
let appDir = path.dirname(require.main.filename)
let config = yaml.safeLoad(fs.readFileSync(`${appDir}/../config.yml`, 'utf8'))
const PORT = config.serverPort
let app = express()

// HTTP request logger middleware
let logger = morgan('combined')
let logDirectory = __dirname + '/logs'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// gzip
app.use(compression())
// to support JSON-encoded bodies
app.use(bodyParser.json())
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}))

// check uid
let isUidValid = (req, res, next) => {
  // check uid
  redis.exists(`user:${req.params.uid}`, (err, exists) => {
    if (exists) {
      return next()
    }
    else {
      // failed
      return res.status(400).json({ msg: "失敗 (uid 不存在)" })
    }
  })
}

// check game server status for game1, game2, game3
let isGameOn = (req, res, next) => {
  let key = req.path.split("/")[1]
  redis.hget("game_status", key, (err, gameStatus) => {
    if (err) {
      return res.status(400).json(gameStatus)
    }
    else if (gameStatus === "off") {
      return res.redirect('/list')
    }
    else {
      next()
    }
  })
}

// admin
let isAdmin = (req, res, next) => {
  let credentials = basicAuth(req)

  if (!credentials ||
    credentials.name !== config.adminBasicAuthName ||
    credentials.pass !== config.adminBasicAuthPassword) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="jjwedding"')
    res.end('Access denied!')
  }
  else {
    return next()
  }
}

// 設定各個遊戲的開關 (有資料的話就不重設了)
redis.exists("game_status", (err, isKeyExisted) => {
  if (!isKeyExisted) {
    console.log("game_status does not exist, create one.")
    redis.hmset("game_status", ["game1", "off", "game2", "off", "game3", "off"], (err, obj) => {
      if (err) throw(err)
    })
  }
  console.log("game_status exists, skip.")
})

// assets
app.use('/css', express.static(__dirname + '/../public/css'))
app.use('/images', express.static(__dirname + '/../public/images'))
app.use('/img', express.static(__dirname + '/../public/img'))
app.use('/js', express.static(__dirname + '/../public/js'))

// htmls
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/login.html'))
})
app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/list.html'))
})
app.get('/game1', isGameOn, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game1.html'))
})
app.get('/game2', isGameOn, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game2.html'))
})
app.get('/game3', isGameOn, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game3.html'))
})

// server pages
app.get('/game1s', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game1s.html'))
})
app.get('/game2s', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game2s.html'))
})
app.get('/game3s', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game3s.html'))
})

// api routes
app.post('/login', handlers.login)
app.post('/user/:uid/submit', isUidValid, handlers.submit)
app.get('/user/:uid/score', isUidValid, handlers.score)
app.get('/user/:uid', handlers.user)

// 開關遊戲 (是否接收遊戲 api 資料更新)
app.post('/toggle/:game', handlers.gameswitch)
// 查詢各遊戲 rank
app.get('/rank/:game', handlers.rank)

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV)
  console.log(`listening on port ${PORT}...`)
})
