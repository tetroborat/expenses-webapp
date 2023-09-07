package handlers

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/tetroborat/expenses-webapp/config"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/auth"
	"time"
)

func Login(c *fiber.Ctx) error {
	user, existingUser := new(models.User), new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.Where("email = ?", user.Email).First(&existingUser)
	if existingUser.ID == 0 {
		return c.Status(404).JSON(fiber.Map{
			"message": "Учётной записи не существует",
		})
	}
	errHash := auth.CompareHashPassword(user.Password, existingUser.Password)
	if !errHash {
		return c.Status(400).JSON(fiber.Map{
			"message": "Неверный пароль",
		})
	}
	expirationTime := time.Now().Add(config.CFG.JwtExpiresIn)
	claims := &models.Claims{
		ID:   existingUser.ID,
		Role: existingUser.Role,
		StandardClaims: jwt.StandardClaims{
			Subject:   existingUser.Email,
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.CFG.JwtSecret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	cookie := &fiber.Cookie{
		Name:    "token",
		Value:   tokenString,
		MaxAge:  config.CFG.JwtMaxAge * 60,
		Expires: expirationTime,
		Domain:  config.CFG.Domain,
		Path:    "/",
		Secure:  false,
		//HTTPOnly: true,
	}
	c.Cookie(cookie)
	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"token":   cookie,
	})
}

func SignUp(c *fiber.Ctx) error {
	user, existingUser := new(models.RegisteringUser), new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.Where("email = ?", user.Email).First(&existingUser)
	if existingUser.ID != 0 {
		return c.Status(400).JSON(fiber.Map{
			"message": fmt.Sprintf("Пользователь <b>%s</b> уже существует", user.Email),
		})
	}
	var errHash error
	user.Password, errHash = auth.GenerateHashPassword(user.Password)
	if errHash != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	newUser := models.User{
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
	}
	database.DB.Create(&newUser)
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func CheckToken(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"success":   true,
		"user_info": utils.GetCurrentUser(c),
	})
}

func Admin(c *fiber.Ctx) error {
	role := c.Get("role")
	if role != "admin" {
		return c.Status(401).JSON(fiber.Map{
			"message": "Страницы не сущетсвует",
		})
	}
	return c.JSON(fiber.Map{
		"success": "premium page",
		"role":    role,
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := &fiber.Cookie{
		Name:   "token",
		Value:  "",
		Domain: config.CFG.Domain,
		Path:   "/",
		Secure: false,
		//HTTPOnly: true,
	}
	c.Cookie(cookie)
	return c.Status(200).JSON(fiber.Map{
		"success": true,
	})
}

func EditUser(c *fiber.Ctx) error {
	editUser := new(models.EditUser)
	if err := c.BodyParser(editUser); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	user := utils.GetCurrentUser(c)
	database.DB.Where("id = ?", user.ID).Updates(models.User{
		Name:       editUser.Name,
		Email:      editUser.Email,
		CurrencyID: editUser.CurrencyID,
	})
	return c.Status(200).JSON(fiber.Map{"success": true})
}
