import redis from '../utils/database.js'

module.exports = (req, res) => {
  let action = req.body.action
  let value = req.body.value || 0
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

  let getUserScore = new Promise((resolve, reject) => {
    redis.hget(`user:${req.params.uid}`, updateKey, (err, score) => {
      if (err) {
        reject("失敗 (查詢分數失敗)")
      }
      else {
        resolve(score)
      }
    })
  })

  getUserScore.then((score) => {
    return new Promise((resolve, reject) => {
      let scoreToWrite = (+score) + (+value)
      redis.hmset(`user:${req.params.uid}`, updateKey, scoreToWrite, (err) => {
        if (err) {
          reject("失敗 (更新失敗)")
        }
        else {
          resolve(scoreToWrite)
        }
      })
    })
  })
  .then((score) => {
    return res.status(200).json({ msg: "成功", action: updateKey, score: score })
  })
  .catch((reason) => {
    res.status(400).json({ msg: msg })
  })
}
