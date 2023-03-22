package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func TransactionRouter(app fiber.Router) {
	router := app.Group("transaction")

	router.Get("/list/:from_date--:to_date", handlers.TransactionsList)

	router.Get("/list-from-expense-type/:type_id/:from_date--:to_date",
		middlewares.IsTypeOwner(),
		handlers.TransactionsList)
	router.Get("/list-from-wallet/:wallet_id/:from_date--:to_date",
		middlewares.IsWalletOwner(),
		handlers.TransactionsList)
	router.Post("/add/:wallet_id/:type_id",
		middlewares.IsWalletOwner(),
		middlewares.IsTypeOwner(),
		handlers.AddTransaction)
	router.Post("/edit/:wallet_id/:type_id",
		middlewares.IsWalletOwner(),
		middlewares.IsTypeOwner(),
		handlers.EditTransaction)
	router.Delete("/delete/:wallet_id/:type_id/:transaction_id",
		middlewares.IsWalletOwner(),
		middlewares.IsTypeOwner(),
		handlers.DeleteTransaction)
}
