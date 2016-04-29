import express from 'express'

import handlers from './handlers'

const PORT = 5566
var app = express()

// routes
app.get('/', handlers.index)
app.get('/test', handlers.test)
app.get('/login', handlers.login)
app.get('/user/:uid/submit', handlers.submit)
app.get('/user/:uid/score', handlers.score)
app.get('/user/:uid', handlers.user)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
