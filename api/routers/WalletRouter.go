package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func WalletRouter(app fiber.Router) {
	router := app.Group("wallet")

	router.Get("/list", handlers.WalletsList)
	router.Post("/add", handlers.AddWallet)

	router.Post("/edit/:wallet_id", middlewares.IsWalletOwner(), handlers.EditWallet)
	router.Delete("/delete/:wallet_id/:with_operation", middlewares.IsWalletOwner(), handlers.DeleteWallet)
	router.Get("/pie-types/:wallet_id/:adding/:from_date--:to_date",
		middlewares.IsWalletOwner(),
		handlers.PieOfWalletTypes)
}
