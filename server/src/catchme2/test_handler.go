package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/garyburd/redigo/redis"
	"github.com/julienschmidt/httprouter"
)

func Test(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	redisConn := RedisPool.Get()
	defer redisConn.Close()

	data, _ := redisConn.Do("KEYS", "user:*")
	strs, _ := redis.Strings(data, nil)
	fmt.Println(strs)

	// data, _ := redisConn.Do("HGETALL", "user:1234568")
	// str, _ := redis.Strings(data, nil)
	// fmt.Println(str)

	// redisConn := redisPool.Get()
	// defer redisConn.Close()
	// data, _ := redisConn.Do("KEYS", "user:*")
	// keys, _ := redis.Strings(data, nil)
	// fmt.Println(keys)

	// for _, key := range keys {
	// 	values, err := redis.Strings(redisConn.Do("HGETALL", key))
	// 	if err != nil {
	// 		// handle error
	// 	}
	// 	for _, v := range values {
	// 		fmt.Println(v)
	// 	}
	// }

	result, _ := json.Marshal(strs)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(result))
}
