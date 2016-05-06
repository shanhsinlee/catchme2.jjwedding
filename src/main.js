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
let config = yaml.safeLoad(fs.readFileSync(process.cwd() + "/config.yml", 'utf8'))
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

// TODO user check name
let isAuthorized = (req, res, next) => {
  if (true) {
    return next()
  }
  else {
    return res.redirect('/')
  }
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

// assets
app.use('/css', express.static(__dirname + '/../public/css'))
app.use('/images', express.static(__dirname + '/../public/images'))
app.use('/img', express.static(__dirname + '/../public/img'))
app.use('/js', express.static(__dirname + '/../public/js'))

// htmls
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/login.html'))
})
app.get('/list', isAuthorized, (req, res) => {
  // TODO if no name, redirect to index page
  res.sendFile(path.join(__dirname + '/../public/list.html'))
})
app.get('/game1', isAuthorized, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game1.html'))
})
app.get('/game2', isAuthorized, (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/game2.html'))
})
app.get('/game3', isAuthorized, (req, res) => {
  res.send("game3")
})
app.get('/overview', isAdmin, (req, res) => {
  res.send("overview")
})

// api routes
app.post('/login', handlers.login)
app.post('/user/:uid/submit', isUidValid, handlers.submit)
app.get('/user/:uid/score', isUidValid, handlers.score)
app.get('/user/:uid', handlers.user)

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV)
  console.log(`listening on port ${PORT}...`)
})
