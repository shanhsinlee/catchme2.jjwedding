import redis from '../utils/database.js'
import models from '../utils/models.js'

const game1User = {
  key: "cheat_1",
  name: "宗翰"
}
const game2User = {
  key: "cheat_2",
  name: "幽默大師"
}
const game3User_1 = {
  key: "cheat_3_1",
  name: "飛球"
}
const game3User_2 = {
  key: "cheat_3_2",
  name: "阿達"
}

let setGame1And2 = (res, uidKey, name, shake, hit) => {
  redis.hmset(`user:${uidKey}`, "name", name, "shake", shake, "hit", hit, "energy", "", (err) => {
    if (err) {
      return res.status(400).json({ error: "Set 失敗 (更新失敗)" })
    }
    else {
      return res.status(200).json({ msg: "Set 成功"})
    }
  })
}

let resetGame1And2 = (res, uidKey) => {
  redis.del(`user:${uidKey}`, (err) => {
    if (err) {
      return res.status(400).json({ error: "Reset 失敗 (更新失敗)" })
    }
    else {
      return res.status(200).json({ msg: "Reset 成功" })
    }
  })
}

let setGame3 = (res) => {
  let user1 = `${game3User_1.key}|${game3User_1.name}`
  let user2 = `${game3User_2.key}|${game3User_2.name}`
  new Promise((resolve, reject) => {
    models.fetchGame3Result((err, game3ResultList) => {
      // 如果裡面有資料再 reset
      let filterData = game3ResultList.filter((user) => {
        let userName = user.split("|")[1]
        return (userName === game3User_1.name || userName === game3User_2.name)
      })

      // 若已有資料，不能多加
      if (filterData.length >= 2) {
        reject("不可設定，已有資料")
      }
      else {
        resolve()
      }
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      redis.lpush("game3_result", user1, (err) => {
        if (err) {
          reject("Set3 失敗 (更新失敗)")
        }
        else {
          resolve()
        }
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      redis.lpush("game3_result", user2, (err) => {
        if (err) {
          reject("Set3 失敗 (更新失敗)")
        }
        else {
          resolve()
        }
      })
    })
  })
  .then(() => {
    return res.status(200).json({ msg: "Set3 成功" })
  })
  .catch((reason) => {
    return res.status(400).json({ error: reason })
  })
}

let resetGame3 = (res) => {
  new Promise((resolve, reject) => {
    models.fetchGame3Result((err, game3ResultList) => {
      // 如果裡面有資料再 reset
      let filterData = game3ResultList.filter((user) => {
        let userName = user.split("|")[1]
        return (userName === game3User_1.name || userName === game3User_2.name)
      })

      // 若有兩個 set 就刪
      if (filterData.length >= 2) {
        resolve()
      }
      else {
        reject("沒有資料可刪")
      }
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      redis.ltrim("game3_result", 2, -1, (err) => {
        if (err) {
          reject("Reset3 失敗 (更新失敗)")
        }
        else {
          resolve()
        }
      })
    })
  })
  .then((result) => {
    return res.status(200).json({ msg: "Reset3 成功" })
  })
  .catch((reason) => {
    return res.status(400).json({ msg: reason })
  })
}

module.exports = (req, res) => {
  let game = req.params.game
  let option = req.params.option
  let data = req.body

  switch (game) {
    case "game1":
      if (option === "set") {
        let shakeCount = 0
        let hitCount = 888
        setGame1And2(res, game1User.key, game1User.name, shakeCount, hitCount)
      }
      else {
        resetGame1And2(res, game1User.key)
      }
      break
    case "game2":
      if (option === "set") {
        let shakeCount = 5566
        let hitCount = 0
        setGame1And2(res, game2User.key, game2User.name, shakeCount, hitCount)
      }
      else {
        resetGame1And2(res, game2User.key)
      }
      break
    case "game3":
      if (option === "set") {
        setGame3(res)
      }
      else {
        resetGame3(res)
      }
      break
  }
}
