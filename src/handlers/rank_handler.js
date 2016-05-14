import redis from '../utils/database.js'
import models from '../utils/models.js'

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
      // TODO
      return res.status(200).json({ msg: "OK" })
      break
    case "game2":
      // TODO
      return res.status(200).json({ msg: "OK" })
      break
    case "game3":
      game3result(res)
      break
    default:
      return res.status(400).json({ msg: "錯誤的參數" })
  }

}
