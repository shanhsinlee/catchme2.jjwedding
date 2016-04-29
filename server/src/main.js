import express from 'express'
import bodyParser from 'body-parser'

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

// routes
app.get('/', handlers.index)
app.get('/test', handlers.test)
app.post('/login', handlers.login)
app.post('/user/:uid/submit', handlers.submit)
app.get('/user/:uid/score', handlers.score)
app.get('/user/:uid', handlers.user)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
