package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
	"gorm.io/gorm"
	"strconv"
)

func TransactionTypeList(c *fiber.Ctx, adding bool) error {
	var (
		types       []models.TransactionType
		totalAmount struct {
			Result float64
		}
		typesWithAmount []models.ResponseTransactionType
	)
	fromDate, toDate := c.Params("from_date"), c.Params("to_date")
	user := utils.GetCurrentUser(c)
	database.DB.
		Where("user_id = ? and adding = ?", user.ID, adding).
		Find(&types)
	for _, item := range types {
		var (
			amount            = 0.0
			amountForCurrency []models.AmountForCurrency
		)
		database.DB.
			Model(&models.Transaction{}).
			Select("currency_id, sum(amount) as amount").
			Preload("Currency").
			Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
			Where("type_id = ?", item.ID).
			Group("currency_id").
			Find(&amountForCurrency)
		for _, item := range amountForCurrency {
			if user.Currency.ID != item.CurrencyID {
				rate := currencies.GetCurrencyRate(user.Currency, item.Currency).Rate
				amount += item.Amount * rate
			} else {
				amount += item.Amount
			}
		}
		typesWithAmount = append(typesWithAmount, models.ResponseTransactionType{
			ID:     item.ID,
			Name:   item.Name,
			Adding: item.Adding,
			Icon:   item.Icon,
			Color:  item.Color,
			Amount: amount,
		})
		totalAmount.Result += amount
	}
	database.DB.
		Unscoped().
		Where("user_id = ? and adding = ?", user.ID, adding).
		Find(&types)
	return c.JSON(fiber.Map{
		"list":             typesWithAmount,
		"list_with_delete": types,
		"total":            totalAmount.Result,
	})
}

func ExpenseTypesList(c *fiber.Ctx) error {
	return TransactionTypeList(c, false)
}

func ReplenishmentTypesList(c *fiber.Ctx) error {
	return TransactionTypeList(c, true)
}

func AddTransactionType(c *fiber.Ctx) error {
	transactionType := new(models.TransactionType)
	if err := c.BodyParser(transactionType); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	transactionType.UserID = utils.GetCurrentUser(c).ID
	database.DB.Create(&transactionType)
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func DeleteTransactionType(c *fiber.Ctx) error {
	var wallets []struct {
		Amount   float64 `json:"amount"`
		WalletID uint    `json:"wallet_id"`
	}
	typeID := c.Params("type_id")
	withOperation, _ := strconv.ParseBool(c.Params("with_operation"))
	database.DB.Delete(&models.TransactionType{}, typeID)
	database.DB.
		Model(&models.Transaction{}).
		Select("wallet_id, sum(amount) as amount").
		Where("type_id = ?", typeID).
		Group("wallet_id").
		Find(&wallets)
	for _, item := range wallets {
		database.DB.
			Model(models.Wallet{}).
			Where("id = ?", item.WalletID).
			Update(
				"amount",
				gorm.Expr("amount + ?", item.Amount),
			)
	}
	if withOperation {
		database.DB.Where("type_id = ?", typeID).Delete(&models.Transaction{})
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func EditTransactionType(c *fiber.Ctx) error {
	typeID := c.Params("type_id")
	transactionType := new(models.EditTransactionType)
	if err := c.BodyParser(transactionType); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.Where("id = ?", typeID).Updates(models.TransactionType{
		Name:   transactionType.Name,
		Adding: transactionType.Adding,
		Icon:   transactionType.Icon,
		Color:  transactionType.Color,
	})
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func PieOfTypeWallets(c *fiber.Ctx) error {
	var walletPie []models.PieOfTypeWalletsItem
	var pieGraphicData []utils.PieGraphicItem
	typeID := c.Params("type_id")
	fromDate, toDate := c.Params("from_date"), c.Params("to_date")
	database.DB.
		Model(&models.Transaction{}).
		Select("wallet_id, sum(amount) as amount").
		Preload("Wallet", func(db *gorm.DB) *gorm.DB {
			return db.Unscoped()
		}).
		Preload("Wallet.Currency").
		Where("type_id = ?", typeID).
		Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
		Group("wallet_id").
		Order("amount desc").
		Find(&walletPie)
	user := utils.GetCurrentUser(c)
	for _, item := range walletPie {
		amount := item.Amount * currencies.GetCurrencyRate(user.Currency, item.Wallet.Currency).Rate
		pieGraphicData = append(pieGraphicData, utils.PieGraphicItem{
			Name:   item.Wallet.Name,
			Color:  item.Wallet.Color,
			Amount: amount,
		})
	}
	return c.Status(200).JSON(pieGraphicData)
}
