import redis from '../utils/database.js'
import uuid from 'node-uuid'

module.exports = (req, res) => {
  let name = req.body.name
  let captcha = req.body.captcha
  let isValid = true

  // TODO check captcha valid
  let isValidCaptcha = (c) => {
    return true
  }

  if (!name || !captcha || !isValidCaptcha(captcha)) {
    isValid = false
    return res.status(400).json({ msg: "未提供參數或驗證碼輸入錯誤" })
  }

  let uid = uuid.v4().split('-').join('')

  redis.hmset(`user:${uid}`, "name", name, "shake", "0", "hit", "0", "energy", "", (err) => {
    if (err) {
      return res.status(400).json({ msg: "失敗 (更新失敗)" })
    }
    else {
      return res.status(200).json({ msg: "成功", uid: uid, name: name })
    }
  })
}
