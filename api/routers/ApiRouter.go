package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func ApiRoutes(app *fiber.App) {
	api := app.Group("api", middlewares.IsAuthorized())
	WalletRouter(api)
	TransactionRouter(api)
	TransactionTypeRouter(api)
	InfoGraphicsRouter(api)

	api.Get("/currencies", handlers.CurrenciesList)
	api.Post("/add-currency", handlers.AddCurrency)
}
