import redis from 'redis'
import yaml from 'js-yaml'
import fs from 'fs'

let config = yaml.safeLoad(fs.readFileSync(process.cwd() + "/config.yml", 'utf8'))

module.exports = redis.createClient(config.redisPort, config.redisHost)
