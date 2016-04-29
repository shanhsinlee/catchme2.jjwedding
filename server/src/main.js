import express from 'express'
import bodyParser from 'body-parser'

import redis from './utils/database.js'
import handlers from './handlers'

const PORT = 5566
var app = express()

// middlewares

// to support JSON-encoded bodies
app.use(bodyParser.json())

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}))

let isUidValid = (req, res, next) => {
  // check uid
  redis.exists(`user:${req.params.uid}`, (err, exists) => {
    if (exists) {
      return next()
    }
    else {
      // failed
      return res.json({ code: 0, msg: "失敗" })
    }
  })
}

// routes
app.get('/', handlers.index)
app.get('/test', handlers.test)
app.post('/login', handlers.login)
app.post('/user/:uid/submit', isUidValid, handlers.submit)
app.get('/user/:uid/score', isUidValid, handlers.score)
app.get('/user/:uid', handlers.user)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
