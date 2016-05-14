import redis from '../utils/database.js'

module.exports = (req, res) => {
  redis.hgetall(`user:${req.params.uid}`, (err, result) => {
    if (result == null) {
      return res.status(400).json({ msg: "失敗 (查詢失敗)" })
    }
    else {
      return res.status(200).json(result)
    }
  })
}
