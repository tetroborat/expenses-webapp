package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
)

func IsWalletOwner() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var wallet models.Wallet
		walletID := c.Params("wallet_id")
		database.DB.Select("user_id").First(&wallet, walletID)
		user := utils.GetCurrentUser(c)
		if wallet.UserID != user.ID {
			return c.Status(400).JSON(fiber.Map{
				"message": "Кошелёк не принадлежит пользователю",
			})
		}
		return c.Next()
	}
}
