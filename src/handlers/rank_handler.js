import redis from '../utils/database.js'
import models from '../utils/models.js'

let game1result = (res) => {
  models.fetchAllUserData().then((userData) => {
    let rank = userData.sort((a, b) => {
      return (+a.hit < +b.hit)
    })
    rank = rank.map((user) => {
      let value = {
        name: user.name,
        score: user.hit,
        uid: user.uid
      }
      return value
    })
    return res.status(200).json(rank)
  }).catch((reason) => {
    return res.status(400).json({ msg: reason })
  })
}

let game2result = (res) => {
  models.fetchAllUserData().then((userData) => {
    let rank = userData.sort((a, b) => {
      return (+a.shake < +b.shake)
    })
    rank = rank.map((user) => {
      let value = {
        name: user.name,
        score: user.shake,
        uid: user.uid
      }
      return value
    })
    return res.status(200).json(rank)
  }).catch((reason) => {
    return res.status(400).json({ msg: reason })
  })
}

let game3result = (res) => {
  new Promise((resolve, reject) => {
    models.fetchGame3Result((err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
  .then((result) => {
    let jsonData = result.map((item) => {
      let bits = item.split("|")
      return { name: bits[1] }
    })
    return res.status(200).json(jsonData)
  })
  .catch((reason) => {
    return res.status(400).json({ msg: reason })
  })
}

module.exports = (req, res) => {
  switch(req.params.game) {
    case "game1":
      game1result(res)
      break
    case "game2":
      game2result(res)
      break
    case "game3":
      game3result(res)
      break
    default:
      return res.status(400).json({ msg: "錯誤的參數" })
  }

}
