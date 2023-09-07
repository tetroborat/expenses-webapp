package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/tetroborat/expenses-webapp/config"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/routers"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
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
		AllowOrigins:     fmt.Sprintf("http://%s:3000, http://%s:3001", config.CFG.Domain, config.CFG.Domain),
		AllowHeaders:     "Content-Type",
		AllowMethods:     "GET, POST, DELETE",
		AllowCredentials: true,
	}))
	routers.ApiRoutes(app)
	routers.AuthRoutes(app)
	err := app.Listen(fmt.Sprintf("%s:3000", config.CFG.Domain))
	if err != nil {
		os.Exit(3)
	}
}
