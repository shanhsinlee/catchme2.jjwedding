package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/julienschmidt/httprouter"
)

type DefaultResponse struct {
	Code int8   `json:"Code"`
	Msg  string `json:"msg"`
}

func main() {
	// connect redis
	ConnectRedis()

	// routes
	router := httprouter.New()
	router.GET("/", Index)
	router.GET("/test", Test)
	router.POST("/login", Login)
	router.POST("/user/:uid/submit", Submit)

	// code execution dir
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	fmt.Println(dir)

	// manual
	fmt.Println("Server listening on port 7788...")

	log.Fatal(http.ListenAndServe(":7788", router))
}
