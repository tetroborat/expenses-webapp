package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
)

func UpdateBaseCurrencyRates() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var wallets []models.Wallet
		user := utils.GetCurrentUser(c)
		database.DB.
			Preload("Currency").
			Where("user_id = ?", user.ID).
			Order("weight").
			Find(&wallets)
		if user.Currency.ID != 0 && !currencies.CheckRelevanceRate(user.Currency.ID) {
			currencies.UpdateCurrenciesRates(user.Currency.ID)
		}
		for _, item := range wallets {
			if !currencies.CheckRelevanceRate(item.Currency.ID) {
				currencies.UpdateCurrenciesRates(item.Currency.ID)
			}
		}
		return c.Next()
	}
}
