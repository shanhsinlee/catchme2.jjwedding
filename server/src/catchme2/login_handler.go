package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var result []byte

	name := r.FormValue("name")
	captcha := r.FormValue("captcha")

	isValid := true

	// TODO check captcha valid
	if name == "" || captcha == "" {
		isValid = false
	}

	uid := strconv.FormatInt(time.Now().UnixNano(), 10) + strconv.Itoa(rand.Intn(100))

	if isValid {
		result, _ = json.Marshal(map[string]string{
			"code": "1",
			"msg":  "成功",
			"uid":  uid,
			"name": name,
		})

		// Write to redis
		redisConn := RedisPool.Get()
		defer redisConn.Close()

		_, err := redisConn.Do("HMSET", fmt.Sprintf("user:%s", uid), "name", name, "shake", "0", "hit", "0", "connected", "false")

		if err != nil {
			result, _ = json.Marshal(DefaultResponse{0, "失敗"})
		}
	} else {
		result, _ = json.Marshal(DefaultResponse{0, "失敗"})
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}
