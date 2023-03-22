package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
)

func AddCurrency(c *fiber.Ctx) error {
	currency := new(models.Currency)
	if err := c.BodyParser(currency); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.Create(&currency)
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func CurrenciesList(c *fiber.Ctx) error {
	var (
		currencies         []models.Currency
		responseCurrencies []models.ResponseCurrency
	)
	database.DB.
		Order("name").
		Find(&currencies)
	for _, item := range currencies {
		responseCurrencies = append(responseCurrencies, models.ResponseCurrency{
			ID:      item.ID,
			Name:    item.Name,
			Symbol:  item.Symbol,
			ISOCode: item.ISOCode,
		})
	}
	return c.JSON(responseCurrencies)
}
