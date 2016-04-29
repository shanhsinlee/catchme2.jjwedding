import express from 'express'

var app = express()

app.get('/', (req, res) => {
    res.send('hello world!')
})

app.listen(5566, () => {
    console.log("listening on port 5566...")
})
