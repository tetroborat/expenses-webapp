package models

import (
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	gorm.Model
	ID          uint            `json:"id"`
	Comment     string          `json:"comment,omitempty"`
	Amount      float64         `json:"amount,omitempty,string"`
	PerformedIn time.Time       `json:"performed_in" form:"performed_in"`
	Currency    Currency        `json:"currency,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:CurrencyID"`
	CurrencyID  uint            `json:"currency_id,omitempty,string" form:"currency_id"`
	Type        TransactionType `json:"type,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:TypeID"`
	TypeID      uint            `json:"type_id,omitempty,string" form:"type_id"`
	Wallet      Wallet          `json:"wallet,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:WalletID"`
	WalletID    uint            `json:"wallet_id,omitempty,string" form:"wallet_id"`
}

type EditTransaction struct {
	ID          uint      `json:"id,string"`
	Amount      float64   `json:"amount,string"`
	PerformedIn time.Time `json:"performed_in"`
	CurrencyID  uint      `json:"currency_id,string"`
	TypeID      uint      `json:"type_id,string"`
	WalletID    uint      `json:"wallet_id,string"`
}

type AmountForCurrency struct {
	Amount     float64 `json:"amount"`
	CurrencyID uint    `json:"currency_id"`
	Currency   Currency
}

type TransactionForMonthLine struct {
	Date   time.Time `json:"date"`
	Amount float64   `json:"amount"`
}
