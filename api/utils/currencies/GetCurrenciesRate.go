package currencies

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
)

type CurrencyRateFromApi struct {
	Date string `json:"date"`
	Info struct {
		Rate      float64 `json:"rate"`
		Timestamp int     `json:"timestamp"`
	} `json:"info"`
	Query struct {
		Amount int    `json:"amount"`
		From   string `json:"from"`
		To     string `json:"to"`
	} `json:"query"`
	Result  float64 `json:"result"`
	Success bool    `json:"success"`
}

func GetCurrenciesRateFromAPI(to string, from string) CurrencyRateFromApi {
	url := fmt.Sprintf(
		"https://api.apilayer.com/fixer/convert?to=%s&from=%s&amount=1",
		to, from,
	)
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	//req.Header.Set("apikey", os.Getenv("CUR_RATE_APIKEY"))
	req.Header.Set("apikey", "GukSfaLjFmoEX5l6qL8LKEuhA3jEw5ii")
	if err != nil {
		fmt.Println(err)
	}
	res, err := client.Do(req)
	if res.Body != nil {
		defer res.Body.Close()
	}
	body, err := ioutil.ReadAll(res.Body)
	var currency CurrencyRateFromApi
	err = json.Unmarshal(body, &currency)
	if err != nil {
		log.Fatal("Error during Unmarshal(): ", err)
	}
	return currency
}

func GetCurrencyRate(currencyTo models.Currency, currencyFrom models.Currency) models.CurrenciesRate {
	var currenciesRate models.CurrenciesRate
	database.DB.First(
		&currenciesRate,
		models.CurrenciesRate{
			CurrencyToID:   currencyTo.ID,
			CurrencyFromID: currencyFrom.ID,
		},
	)
	//database.DB.FirstOrInit(
	//	&currenciesRate,
	//	models.CurrenciesRate{
	//		CurrencyToID:   currencyTo.ID,
	//		CurrencyFromID: currencyFrom.ID,
	//	},
	//)
	//loc, _ := time.LoadLocation("Europe/Moscow")
	//now := time.Now().In(loc)
	//startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	//if currenciesRate.UpdatedAt.Before(startOfDay) || currenciesRate.Rate == 0 {
	//	currentAPIRate := GetCurrenciesRateFromAPI(currencyTo.ISOCode, currencyFrom.ISOCode)
	//	currenciesRate.Rate = currentAPIRate.Result
	//	database.DB.Save(&currenciesRate)
	//}
	return currenciesRate
}
