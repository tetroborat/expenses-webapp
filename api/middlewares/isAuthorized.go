package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils/auth"
	"strings"
)

func IsAuthorized() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenString string
		authorization := c.Get("Authorization")
		if strings.HasPrefix(authorization, "Bearer ") {
			tokenString = strings.TrimPrefix(authorization, "Bearer ")
		} else if c.Cookies("token") != "" {
			tokenString = c.Cookies("token")
		}
		claims, err := auth.ParseToken(tokenString)
		if err != nil {
			return c.Status(402).JSON(fiber.Map{
				"message": "Пользователь не зарегистрирован",
			})
		}
		var user models.User
		database.DB.
			Preload("Currency").
			First(&user, claims.ID)
		if user.ID != claims.ID {
			return c.Status(403).JSON(fiber.Map{
				"message": "Пользователь больше не существует",
			})
		}
		c.Locals("user", models.FilterUserRecord(&user))
		return c.Next()
	}
}
