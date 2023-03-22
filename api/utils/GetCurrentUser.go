package utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/models"
)

func GetCurrentUser(c *fiber.Ctx) models.UserInfo {
	user := c.Locals("user").(models.UserInfo)
	return user
}
