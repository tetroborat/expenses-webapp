package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
	"gorm.io/gorm"
)

func AddTransaction(c *fiber.Ctx) error {
	transaction := new(models.Transaction)
	if err := c.BodyParser(transaction); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	wallet := transaction.Wallet
	database.DB.
		Select("id").
		First(&wallet, transaction.WalletID)
	database.DB.Create(&transaction)
	database.DB.
		Model(&wallet).
		Update("amount", gorm.Expr("amount - ?", transaction.Amount))
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func TransactionsList(c *fiber.Ctx) error {
	var (
		transactions         []models.Transaction
		responseTransactions []models.ResponseTransaction
		totalAmount          struct {
			Result float64
		}
	)
	walletID, typeID := c.Params("wallet_id"), c.Params("type_id")
	fromDate, toDate := c.Params("from_date"), c.Params("to_date")
	query := database.DB.
		Preload("Currency").
		Preload("Wallet").
		Preload("Type", func(db *gorm.DB) *gorm.DB {
			return db.Unscoped()
		}).
		Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
		Order("performed_in DESC")
	user := utils.GetCurrentUser(c)
	if walletID != "" {
		query.Where("wallet_id = ?", walletID).Find(&transactions)
		database.DB.
			Model(&models.Transaction{}).
			Select("sum (amount) as result").
			Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
			Where("wallet_id = ?", walletID).
			Scan(&totalAmount)
		for _, transaction := range transactions {
			responseTransactions = append(responseTransactions, models.ResponseTransaction{
				ID:          transaction.ID,
				Amount:      transaction.Amount,
				PerformedIn: transaction.PerformedIn,
				Symbol:      transaction.Currency.Symbol,
				CurrencyID:  transaction.CurrencyID,
				TypeName:    transaction.Type.Name,
				TypeID:      transaction.TypeID,
				WalletID:    transaction.WalletID,
			})
		}
	} else {
		if typeID != "" {
			query.Where("type_id = ?", typeID).Find(&transactions)
		} else {
			query.
				Where("(type_id in (?) or wallet_id in (?))",
					database.DB.
						Unscoped().
						Model(models.TransactionType{}).
						Select("id").
						Where("user_id = ?", user.ID),
					database.DB.
						Unscoped().
						Model(models.Wallet{}).
						Select("id").
						Where("user_id = ?", user.ID)).
				Find(&transactions)
		}
		for _, transaction := range transactions {
			if user.Currency.ID != transaction.CurrencyID {
				rate := currencies.GetCurrencyRate(user.Currency, transaction.Currency).Rate
				totalAmount.Result += transaction.Amount * rate
			} else {
				totalAmount.Result += transaction.Amount
			}
			responseTransactions = append(responseTransactions, models.ResponseTransaction{
				ID:          transaction.ID,
				Amount:      transaction.Amount,
				PerformedIn: transaction.PerformedIn,
				Symbol:      transaction.Currency.Symbol,
				CurrencyID:  transaction.CurrencyID,
				TypeName:    transaction.Type.Name,
				TypeID:      transaction.TypeID,
				WalletID:    transaction.WalletID,
			})
		}
	}
	return c.JSON(fiber.Map{
		"list":  responseTransactions,
		"total": totalAmount.Result,
	})
}

func DeleteTransaction(c *fiber.Ctx) error {
	transactionID := c.Params("transaction_id")
	transaction := new(models.Transaction)
	database.DB.
		Select("id, wallet_id, amount").
		First(&transaction, transactionID)
	database.DB.Delete(transaction)
	database.DB.
		Model(models.Wallet{}).
		Where("id = ?", transaction.WalletID).
		Update(
			"amount",
			gorm.Expr("amount + ?", transaction.Amount),
		)
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func EditTransaction(c *fiber.Ctx) error {
	existingTransaction := new(models.Transaction)
	transaction := new(models.EditTransaction)
	if err := c.BodyParser(transaction); err != nil {
		return c.Status(500).JSON(fiber.Map{})
	}
	database.DB.
		Select("amount").
		First(&existingTransaction, transaction.ID)
	database.DB.Where("id = ?", transaction.ID).Updates(models.Transaction{
		Amount:      transaction.Amount,
		PerformedIn: transaction.PerformedIn,
		CurrencyID:  transaction.CurrencyID,
		TypeID:      transaction.TypeID,
		WalletID:    transaction.WalletID,
	})
	database.DB.
		Model(models.Wallet{}).
		Where("id = ?", transaction.WalletID).
		Update(
			"amount",
			gorm.Expr("amount - ?", transaction.Amount-existingTransaction.Amount),
		)
	return c.Status(200).JSON(fiber.Map{"success": true})
}
