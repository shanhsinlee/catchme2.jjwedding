import redis from '../utils/database.js'

module.exports = (req, res) => {
  let resp = (result) => {
    if (result == null) {
      res.json({ code: 0, msg: "not found" })
    }
    else {
      res.json(result)
    }
  }

  redis.hgetall(`user:${req.params.uid}`, (err, obj) => {
    resp(obj)
  })
}
