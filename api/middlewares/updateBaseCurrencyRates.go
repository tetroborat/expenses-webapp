package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
)

func UpdateBaseCurrencyRates() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := utils.GetCurrentUser(c)
		if !currencies.CheckRelevanceRate(user.Currency.ID) {
			currencies.UpdateCurrenciesRates(user.Currency.ID)
		}
		return c.Next()
	}
}
