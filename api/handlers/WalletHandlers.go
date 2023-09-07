package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
	"strconv"
)

func AddWallet(c *fiber.Ctx) error {
	wallet := new(models.Wallet)
	if err := c.BodyParser(wallet); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	wallet.UserID = utils.GetCurrentUser(c).ID
	database.DB.Create(&wallet)
	if wallet.ID != 0 {
		return c.Status(200).JSON(fiber.Map{"success": true})
	} else {
		return c.Status(400).JSON(fiber.Map{
			"message": "db error",
		})
	}
}

func WalletsList(c *fiber.Ctx) error {
	var (
		wallets         []models.Wallet
		responseWallets []models.ResponseWallet
		totalAmount     float64
	)
	user := utils.GetCurrentUser(c)
	database.DB.
		Preload("Currency").
		Where("user_id = ?", user.ID).
		Order("weight").
		Find(&wallets)
	for _, wallet := range wallets {
		rate := currencies.GetCurrencyRate(user.Currency, wallet.Currency).Rate
		totalAmount +=
			wallet.Amount * rate
		responseWallets = append(responseWallets, models.ResponseWallet{
			ID:         wallet.ID,
			Name:       wallet.Name,
			Amount:     wallet.Amount,
			Icon:       wallet.Icon,
			Color:      wallet.Color,
			CurrencyID: wallet.CurrencyID,
			Symbol:     wallet.Currency.Symbol,
		})
	}
	return c.JSON(fiber.Map{
		"list":  responseWallets,
		"total": totalAmount,
	})
}

func DeleteWallet(c *fiber.Ctx) error {
	walletID := c.Params("wallet_id")
	withOperation, _ := strconv.ParseBool(c.Params("with_operation"))
	database.DB.Delete(&models.Wallet{}, walletID)
	if withOperation {
		database.DB.Where("wallet_id = ?", walletID).Delete(&models.Transaction{})
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func EditWallet(c *fiber.Ctx) error {
	wallet := new(models.EditWallet)
	if err := c.BodyParser(wallet); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.Where("id = ?", wallet.ID).Updates(models.Wallet{
		Name:       wallet.Name,
		Amount:     wallet.Amount,
		Icon:       wallet.Icon,
		Color:      wallet.Color,
		CurrencyID: wallet.CurrencyID,
	})
	return c.Status(200).JSON(fiber.Map{"success": true})
}
