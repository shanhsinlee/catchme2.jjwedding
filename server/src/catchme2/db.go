package main

import (
	"flag"
	"time"

	"github.com/garyburd/redigo/redis"
)

var (
	RedisPool     *redis.Pool
	redisServer   = flag.String("redisServer", ":7372", "")
	redisPassword = flag.String("redisPassword", "", "")
)

func newRedisPool(server, password string) *redis.Pool {
	return &redis.Pool{
		MaxIdle:     3,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", server)
			if err != nil {
				return nil, err
			}
			return c, err
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

func ConnectRedis() {
	flag.Parse()
	RedisPool = newRedisPool(*redisServer, *redisPassword)
}
