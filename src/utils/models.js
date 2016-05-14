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

  fetchAllUserData() {
    return new Promise((resolve, reject) => {
      redis.keys("user:*", (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    })
    .then((keys) => {
      return new Promise((resolve, reject) => {
        var multi = redis.multi()
        keys.forEach((key) => {
          multi.hgetall(key, redis.print)
        })
        multi.exec((err, result) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(result)
          }
        })
      })
    })
  }
}

module.exports = new models
