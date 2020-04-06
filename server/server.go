package main

import (
	"github.com/gramework/gramework"
)

func main() {
	app := gramework.New()

	app.GET("/", "hello, grameworld")

	app.ListenAndServe("0.0.0.0:1111")
}
