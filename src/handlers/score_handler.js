import redis from '../utils/database.js'

module.exports = (req, res) => {
  let action = req.query.action
  let updateKey = ""

  if (action === "hit") {
    updateKey = "hit"
  }
  else if (action === "shake") {
    updateKey = "shake"
  }
  else {
    // invalid action
    return res.status(400).json({ msg: "失敗 (未提供 action params)" })
  }

  redis.hmget(`user:${req.params.uid}`, "name", updateKey, (err, reply) => {
    if (reply == null) {
      return res.status(400).json({ msg: "失敗 (查詢失敗)" })
    }
    else {
      let jsonData = { name: reply[0] }
      jsonData[updateKey] = reply[1]
      return res.status(200).json(jsonData)
    }
  })
}
