import redis from '../utils/database.js'

module.exports = (req, res) => {
  let action = req.body.action
  let value = req.body.value || 0 // TODO ask this value is for appending or it's a total number
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

  redis.hmset(`user:${req.params.uid}`, updateKey, value, (err) => {
    if (err) {
      return res.json({ code: 0, msg: "失敗 (更新失敗)" })
    }
    else {
      return res.json({ code: 1, msg: "成功" })
    }
  })
}
