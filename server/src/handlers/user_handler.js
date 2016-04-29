import redis from '../utils/database.js'

module.exports = (req, res) => {
  let resp = (result) => {
    if (result == null) {
      return res.json({ code: 0, msg: "失敗" })
    }
    else {
      return res.json(result)
    }
  }

  redis.hgetall(`user:${req.params.uid}`, (err, obj) => {
    resp(obj)
  })
}
