package utils

import (
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
)

func CheckAddingTransaction(typeID uint) bool {
	var actualRate bool
	database.DB.
		Model(&models.TransactionType{}).
		Select("adding").
		Where("id = ?", typeID).
		Scan(&actualRate)
	return actualRate
}
