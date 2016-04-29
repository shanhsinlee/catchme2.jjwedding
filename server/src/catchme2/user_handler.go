package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func User(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var result []byte

	uid := ps.ByName("uid")

	// Write to redis
	redisConn := RedisPool.Get()
	defer redisConn.Close()

	reply, err := redisConn.Do("HGETALL", fmt.Sprintf("user:%s", uid))

	// TODO fix this, you can not marshal reply directly
	result, err = json.Marshal(reply)

	if err != nil || len(result) == 2 { // result == "[]"
		result, _ = json.Marshal(DefaultResponse{0, "失敗"})
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}
