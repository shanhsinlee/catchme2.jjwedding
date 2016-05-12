import redis from '../utils/database.js'

module.exports = (req, res) => {
  let gameName = req.params.game

  let getGameSwitchStatus = new Promise((resolve, reject) => {
    redis.hget("game_status", gameName, (err, status) => {
      // 沒這個 key 或狀態的話
      if (status === null) {
        reject("失敗 (查詢遊戲開關狀態失敗)")
      }
      else {
        resolve(status)
      }
    })
  })
  .catch((reason) => {
    res.status(400).json({ msg: reason })
  })

  getGameSwitchStatus.then((status) => {
    let updateStatus = (status === "on") ? "off" : "on"
    return new Promise((resolve, reject) => {
      redis.hset("game_status", gameName, updateStatus, (err, obj) => {
        if (err) {
          reject("失敗 (設定遊戲開關狀態失敗)")
        }
        else {
          resolve(updateStatus)
        }
      })
    })
  })
  .then((updateStatus) => {
    return res.status(200).json({ game_name: gameName, now_status: updateStatus})
  })
  .catch((reason) => {
    res.status(400).json({ msg: reason })
  })
}
