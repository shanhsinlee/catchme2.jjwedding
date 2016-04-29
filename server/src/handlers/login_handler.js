import redis from '../utils/database.js'
import uuid from 'node-uuid'

module.exports = (req, res) => {
  let name = req.body.name
  let captcha = req.body.captcha
  let isValid = true

  // TODO check captcha valid
  let checkCaptcha = (c) => {
    return true
  }

  if (!name || !captcha || checkCaptcha(captcha)) {
    isValid = false
  }

  let uid = uuid.v4().split('-').join('')

  redis.hmset(`user:${uid}`, "name", name, "shake", "0", "hit", "0", "connected", "false", (err) => {
    if (err) {
      return res.json({ code: 0, msg: "失敗" })
    }
    else {
      return res.json({ code: 1, msg: "成功", uid: uid, name: name })
    }
  })
}
