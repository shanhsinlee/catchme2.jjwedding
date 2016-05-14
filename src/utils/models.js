import redis from './database.js'

class models {
  writeGame3Result(userData) {
    let data = `${userData.uid}|${userData.name}`
    redis.rpush("game3_result", data, (err) => {

    })
  }
  fetchGame3Result(callback) {
    redis.lrange("game3_result", 0, -1, (err, result) => {
      if (err) {
        callback(err, null)
      }
      else {
        callback(null, result)
      }
    })
  }
}

module.exports = new models
