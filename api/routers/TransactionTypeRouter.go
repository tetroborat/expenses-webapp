package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func TransactionTypeRouter(app fiber.Router) {
	router := app.Group("transaction-type")

	router.Get("/replenishment-list/:from_date--:to_date", handlers.ReplenishmentTypesList)
	router.Get("/expense-list/:from_date--:to_date", handlers.ExpenseTypesList)
	router.Post("/add", handlers.AddTransactionType)

	router.Post("/edit/:type_id", middlewares.IsTypeOwner(), handlers.EditTransactionType)
	router.Delete("/delete/:type_id", middlewares.IsTypeOwner(), handlers.DeleteTransactionType)
	router.Get("/pie-wallets/:type_id/:from_date--:to_date",
		middlewares.IsTypeOwner(),
		handlers.PieOfTypeWallets)
}
