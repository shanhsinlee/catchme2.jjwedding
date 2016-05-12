import redis from '../utils/database.js'

module.exports = (req, res) => {
  let action = req.body.action
  let value = req.body.value || 0
  let updateKey = ""

  // check game switch
  let checkGameSwitch = new Promise((resolve, reject) => {
    redis.hgetall("game_status", (err, gameStatus) => {
      if (err) {
        reject("查詢遊戲開關錯誤")
      }
      else {
        if (action === "hit") {
          if (gameStatus.game1 !== "on") {
            reject("遊戲尚未開始")
          }
          else {
            updateKey = "hit"
            resolve(true)
          }
        }
        else if (action === "shake") {
          if (gameStatus.game2 !== "on") {
            reject("遊戲尚未開始")
          }
          else {
            updateKey = "shake"
            resolve(true)
          }
        }
        else {
          // invalid action
          reject("失敗 (未提供 action params)")
        }
      }
    })
  })
  .catch((reason) => {
    res.status(400).json({ msg: reason })
  })

  checkGameSwitch.then(() => {
    return new Promise((resolve, reject) => {
      redis.hget(`user:${req.params.uid}`, updateKey, (err, score) => {
        if (err) {
          reject("失敗 (查詢分數失敗)")
        }
        else {
          resolve(score)
        }
      })
    })
  })
  .then((score) => {
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
    res.status(400).json({ msg: reason })
  })
}
