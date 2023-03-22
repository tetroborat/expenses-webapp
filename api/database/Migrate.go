package database

import (
	"github.com/tetroborat/expenses-webapp/models"
	"log"
	"os"
)

func MigrateDB() {
	log.Println("running migrations")
	err := DB.AutoMigrate(
		models.Transaction{},
		models.Currency{},
		models.TransactionType{},
		models.Wallet{},
		models.CurrenciesRate{},
		models.User{},
	)
	if err != nil {
		os.Exit(2)
	}
}
