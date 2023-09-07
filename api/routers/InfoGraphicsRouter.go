package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func InfoGraphicsRouter(app fiber.Router) {
	router := app.Group("infographic")

	router.Get("/pie-types/:wallet_id/:adding/:from_date--:to_date",
		middlewares.IsWalletOwner(),
		handlers.PieOfWalletTypes)
	router.Get("/pie-wallets/:type_id/:from_date--:to_date",
		middlewares.IsTypeOwner(),
		handlers.PieOfTypeWallets)
	router.Get("/month-lines/:from_date--:to_date",
		handlers.LinesOfMonthTransactions)
}
