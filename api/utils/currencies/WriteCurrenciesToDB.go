package currencies

import (
	"encoding/json"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"gorm.io/gorm/clause"
	"io/ioutil"
	"log"
)

type CurrencyFromJsonList struct {
	Name   string `json:"rus_name"`
	Symbol string `json:"symbol"`
	Code   string `json:"iso_code"`
}

func UpsertCurrency() {
	content, err := ioutil.ReadFile("./currencies.json")
	if err != nil {
		log.Fatal("Error when opening file: ", err)
	}
	var (
		currenciesJSON []CurrencyFromJsonList
		currencies     []models.Currency
	)
	err = json.Unmarshal(content, &currenciesJSON)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
	for _, element := range currenciesJSON {
		currencies = append(currencies, models.Currency{
			Name:    element.Name,
			Symbol:  element.Symbol,
			ISOCode: element.Code,
		})
	}
	database.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "iso_code"}},
		DoUpdates: clause.AssignmentColumns([]string{"name", "symbol"}),
	}).Create(&currencies)
}
