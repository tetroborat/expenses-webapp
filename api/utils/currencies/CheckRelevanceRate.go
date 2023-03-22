package currencies

import (
	"github.com/tetroborat/expenses-webapp/database"
)

func CheckRelevanceRate(fromID uint) bool {
	var actualRate bool
	database.DB.
		Raw("select exists(select 1 from currencies_rates where currency_from_id = ? and updated_at > current_date)", fromID).
		Scan(&actualRate)
	return actualRate
}
