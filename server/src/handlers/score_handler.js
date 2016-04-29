import redis from '../utils/database.js'

module.exports = (req, res) => {
  console.log(req.query)
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
    return res.json({ code: 0, msg: "失敗 (未提供 action params)" })
  }

  redis.hmget(`user:${req.params.uid}`, "name", updateKey, (err, reply) => {
    if (reply == null) {
      return res.json({ code: 0, msg: "失敗 (查詢失敗)" })
    }
    else {
      let jsonData = { name: reply[0] }
      jsonData[updateKey] = reply[1]
      return res.json(jsonData)
    }
  })
}
