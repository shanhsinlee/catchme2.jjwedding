import redis from '../utils/database.js'

module.exports = (req, res) => {
  let action = req.body.action
  let value = req.body.value || 0
  let updateKey = ""
  let userData = null

  // check game switch
  let checkGameSwitch = new Promise((resolve, reject) => {
    redis.hgetall("game_status", (err, gameStatus) => {
      if (err) {
        reject("查詢遊戲開關錯誤")
      }
      else {
        switch (action) {
          // 關卡一
          case "hit":
            if (gameStatus.game1 !== "on") {
              reject("遊戲尚未開始")
            }
            else {
              updateKey = "hit"
              resolve(true)
            }
            break
          // 關卡二
          case "shake":
            if (gameStatus.game2 !== "on") {
              reject("遊戲尚未開始")
            }
            else {
              updateKey = "shake"
              resolve(true)
            }
            break
          // 關卡三
          case "energy":
            if (gameStatus.game3 !== "on") {
              reject("遊戲尚未開始")
            }
            else {
              updateKey = "energy"
              resolve(true)
            }
            break
          default:
            // invalid action
            reject("失敗 (未提供 action params)")
            break
        }
      }
    })
  })
  .catch((reason) => {
    res.status(400).json({ msg: reason })
  })

  checkGameSwitch.then(() => {
    // 查詢使用者遊戲分數
    return new Promise((resolve, reject) => {
      redis.hgetall(`user:${req.params.uid}`, (err, result) => {
        if (err) {
          reject("失敗 (查詢分數失敗)")
        }
        else {
          userData = result
          resolve(userData[updateKey])
        }
      })
    })
  })
  .then((score) => {
    return new Promise((resolve, reject) => {
      let scoreToWrite = 0

      switch (action) {
        case "hit":
          // 遊戲一直接將總和寫入
          scoreToWrite = (+value)
          break
        case "shake":
          // 遊戲二是 append 分數
          scoreToWrite = (+score) + (+value)
          break
        case "energy":
          // 遊戲三只要將名單記到某個 list 就行，並將 user 的 energy 資料改成 "0"
          scoreToWrite = 0
          // TODO 將順序寫到 list 裡
          break
        default:
          break
      }

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
    let jsonData = { name: userData.name }
    jsonData[updateKey] = score
    return res.status(200).json(jsonData)
  })
  .catch((reason) => {
    res.status(400).json({ msg: reason })
  })
}
