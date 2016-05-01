import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import FileStreamRotator from 'file-stream-rotator'
import fs from 'fs'

import redis from './utils/database.js'
import handlers from './handlers'
import configs from './configs/config.js'

// predefine
const PORT = configs.serverPort
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

// routes
app.get('/', handlers.index)
app.post('/login', handlers.login)
app.post('/user/:uid/submit', isUidValid, handlers.submit)
app.get('/user/:uid/score', isUidValid, handlers.score)
app.get('/user/:uid', handlers.user)

// htmls
// app.use('/css', express.static(__dirname + '../../web/css'))
// app.use('/images', express.static(__dirname + '../../web/images'))
// app.use('/img', express.static(__dirname + '../../web/img'))
// app.use('/js', express.static(__dirname + '../../web/js'))

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV)
  console.log(`listening on port ${PORT}...`)
})
