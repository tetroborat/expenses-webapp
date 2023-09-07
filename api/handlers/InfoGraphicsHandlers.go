package handlers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"github.com/tetroborat/expenses-webapp/database"
	"github.com/tetroborat/expenses-webapp/models"
	"github.com/tetroborat/expenses-webapp/utils"
	"github.com/tetroborat/expenses-webapp/utils/currencies"
	"gorm.io/gorm"
)

func PieOfWalletTypes(c *fiber.Ctx) error {
	var (
		transactionTypePie []models.PieOfWalletTypesItem
		pieGraphicData     []utils.PieGraphicItem
	)
	walletID, adding := c.Params("wallet_id"), c.Params("adding")
	fromDate, toDate := c.Params("from_date"), c.Params("to_date")
	database.DB.
		Model(&models.Transaction{}).
		Select("type_id, sum(amount) as amount").
		Preload("Type", func(db *gorm.DB) *gorm.DB {
			return db.Where("adding = ?", adding).Unscoped()
		}).
		Where("wallet_id = ?", walletID).
		Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
		Group("type_id").
		Order("amount desc").
		Find(&transactionTypePie)
	for _, item := range transactionTypePie {
		pieGraphicData = append(pieGraphicData, utils.PieGraphicItem{
			Name:   item.Type.Name,
			Color:  item.Type.Color,
			Amount: item.Amount,
		})
	}
	return c.Status(200).JSON(pieGraphicData)
}

func PieOfTypeWallets(c *fiber.Ctx) error {
	var (
		walletPie      []models.PieOfTypeWalletsItem
		pieGraphicData []utils.PieGraphicItem
	)
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

func LinesOfMonthTransactions(c *fiber.Ctx) error {
	var (
		transactions       []models.TransactionForMonthLine
		listCurrencyID     []string
		listWalletID       []string
		listReplTypeID     []string
		currencyRate       float64
		currencyID         uint
		resultDataResponse []map[string]string
		monthList          []string
	)
	resultData := map[int]map[string]float64{}
	user := utils.GetCurrentUser(c)
	database.DB.
		Unscoped().
		Model(models.Wallet{}).
		Select("id").
		Where("user_id = ?", user.ID).
		Scan(pq.Array(&listWalletID))
	database.DB.
		Unscoped().
		Model(models.TransactionType{}).
		Select("id").
		Where("user_id = ?", user.ID).
		Where("adding = true").
		Scan(pq.Array(&listReplTypeID))
	fromDate, _ := time.Parse(time.RFC3339, c.Params("from_date"))
	toDate, _ := time.Parse(time.RFC3339, c.Params("to_date"))
	database.DB.
		Model(models.Transaction{}).
		Select("currency_id").
		Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
		Where("wallet_id in (?)", listWalletID).
		Not("type_id in (?)", listReplTypeID).
		Group("currency_id").
		Scan(pq.Array(&listCurrencyID))
	for _, item := range listCurrencyID {
		currencyID = utils.StrToUint(item)
		database.DB.
			Model(models.Transaction{}).
			Select("date_trunc('day', performed_in) as date, sum(amount) as amount").
			Where("performed_in BETWEEN ? AND ?", fromDate, toDate).
			Where("wallet_id in (?)", listWalletID).
			Where("currency_id = ?", item).
			Group("date").
			Order("date").
			Find(&transactions)
		if currencyID != user.Currency.ID {
			database.DB.
				Model(&models.CurrenciesRate{}).
				Select("rate").
				Where(&models.CurrenciesRate{
					CurrencyFromID: currencyID,
					CurrencyToID:   user.Currency.ID,
				}).
				Scan(&currencyRate)
		} else {
			currencyRate = 1
		}
		for _, item := range transactions {
			month, amount := item.Date.Month().String(), item.Amount*currencyRate
			dayItem, dayExist := resultData[item.Date.Day()]
			if !dayExist {
				if utils.CheckDuplicateInStringArray(monthList, month) {
					monthList = append(monthList, month)
				}
				resultData[item.Date.Day()] = map[string]float64{
					month: amount,
				}
			} else {
				monthItem, monthExist := dayItem[month]
				if !monthExist {
					if utils.CheckDuplicateInStringArray(monthList, month) {
						monthList = append(monthList, month)
					}
					dayItem[month] = amount
				} else {
					monthItem += amount
				}
			}
		}
	}
	for day := 1; day <= 31; day++ {
		dayData, dayExist := resultData[day]
		item := map[string]string{"name": strconv.Itoa(day)}
		if dayExist {
			for _, month := range monthList {
				monthData, monthExist := dayData[month]
				if !monthExist {
					monthData = 0
				}
				if day > 1 {
					preDayData := resultDataResponse[day-2]
					preMonthData, preMonthExist := preDayData[month]
					if preMonthExist {
						if n, err := strconv.ParseFloat(preMonthData, 64); err == nil {
							monthData += n
						}
					}
				}
				if monthData != 0.0 {
					item[month] = fmt.Sprintf("%.2f", monthData)
				}
			}
		} else {
			for _, month := range monthList {
				monthData := 0.0
				if day > 1 {
					preDayData := resultDataResponse[day-1]
					preMonthData, preMonthExist := preDayData[month]
					if preMonthExist {
						if n, err := strconv.ParseFloat(preMonthData, 64); err == nil {
							monthData += n
						}
					}
				}
				if monthData != 0.0 {
					item[month] = fmt.Sprintf("%.2f", monthData)
				}
			}
		}
		resultDataResponse = append(resultDataResponse, item)
	}
	return c.Status(200).JSON(fiber.Map{
		"data":       resultDataResponse,
		"month_list": monthList,
	})
}
