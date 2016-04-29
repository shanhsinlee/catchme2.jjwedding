import redis from 'redis'

const REDIS_HOST = "localhost"
const REDIS_PORT = 7372

module.exports = redis.createClient(REDIS_PORT, REDIS_HOST)
