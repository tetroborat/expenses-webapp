package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/handlers"
	"github.com/tetroborat/expenses-webapp/middlewares"
)

func AuthRoutes(app *fiber.App) {
	login := app.Group("auth")

	login.Get("/check-token",
		middlewares.IsAuthorized(),
		middlewares.UpdateBaseCurrencyRates(),
		handlers.CheckToken)
	//login.Get("/admin", handlers.Admin)
	login.Get("/logout", handlers.Logout)

	login.Post("/login", handlers.Login)
	login.Post("/signup", handlers.SignUp)
	login.Post("/edit_user",
		middlewares.IsAuthorized(),
		handlers.EditUser)
}
