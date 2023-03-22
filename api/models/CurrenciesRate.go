package models

import (
	"gorm.io/gorm"
)

type CurrenciesRate struct {
	gorm.Model
	Rate           float64  `json:"rate,omitempty"`
	CurrencyFrom   Currency `json:"currency_from,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:CurrencyFromID"`
	CurrencyFromID uint     `json:"currency_from_id,omitempty,string" form:"currency_from_id"`
	CurrencyTo     Currency `json:"currency_to,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:CurrencyToID"`
	CurrencyToID   uint     `json:"currency_to_id,omitempty,string" form:"currency_to_id"`
}
