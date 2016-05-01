import redis from 'redis'
import configs from '../configs/config.js'

module.exports = redis.createClient(configs.redisPort, configs.redisHost)
