package utils

import (
	"encoding/json"
	"fmt"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"io/ioutil"
	"log"
	"time"
)

type OperationFromJsonList struct {
	Comment string  `json:"comment"`
	Date    string  `json:"date"`
	Name    string  `json:"name"`
	Code    string  `json:"iso_code"`
	Amount  float64 `json:"amount"`
}

func UpsertOperations() {
	content, err := ioutil.ReadFile("./operations.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}
	var (
		operationsJSON []OperationFromJsonList
		operations     []models.Transaction
	)
	operationsForType := map[string]models.TransactionType{}
	err = json.Unmarshal(content, &operationsJSON)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
	for _, element := range operationsJSON {
		operationType, exist := operationsForType[element.Name]
		if !exist {
			operationType = models.TransactionType{
				Name:   element.Name,
				UserID: 1,
				Adding: false,
			}
			database.DB.Where("name = ?", element.Name).FirstOrCreate(&operationType)
			operationsForType[element.Name] = operationType
		}
		date, _ := time.Parse("02.01.2006", element.Date)
		operations = append(operations, models.Transaction{
			Comment:     element.Comment,
			TypeID:      operationType.ID,
			Amount:      element.Amount,
			PerformedIn: date,
			WalletID:    1,
			CurrencyID:  145,
		})
	}
	fmt.Println(operationsForType)
	database.DB.Create(&operations)
}
