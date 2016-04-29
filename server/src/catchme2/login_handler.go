package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("Login"))
}
