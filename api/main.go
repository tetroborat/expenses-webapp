package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/tetroborat/expenses-webapp/config"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/routers"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
	"os"
)

func initDB() {
	database.ConnectDB()
	database.MigrateDB()
	currencies.UpsertCurrency()
	//utils.UpsertOperations()
}

func main() {
	config.LoadConfig(".")
	initDB()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://192.168.1.105:3000, http://192.168.1.105:3001",
		AllowHeaders:     "Content-Type",
		AllowMethods:     "GET, POST, DELETE",
		AllowCredentials: true,
	}))
	routers.ApiRoutes(app)
	routers.AuthRoutes(app)
	err := app.Listen("192.168.1.105:3000")
	if err != nil {
		os.Exit(3)
	}
}
