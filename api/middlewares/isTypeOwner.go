package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
)

func IsTypeOwner() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var transactionType models.TransactionType
		typeID := c.Params("type_id")
		database.DB.Select("user_id").First(&transactionType, typeID)
		user := utils.GetCurrentUser(c)
		if transactionType.UserID != user.ID {
			return c.Status(400).JSON(fiber.Map{
				"message": "Тип операции не принадлежит пользователю",
			})
		}
		return c.Next()
	}
}
