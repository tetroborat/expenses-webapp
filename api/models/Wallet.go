package models

import (
	"gorm.io/gorm"
)

type Wallet struct {
	gorm.Model
	Name         string        `json:"name"`
	Amount       float64       `json:"amount,string"`
	Icon         string        `json:"icon"`
	Color        string        `json:"color"`
	Currency     Currency      `json:"currency,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:CurrencyID"`
	CurrencyID   uint          `json:"currency_id,omitempty,string" form:"currency_id"`
	User         User          `json:"user,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:UserID"`
	UserID       uint          `json:"user_id,omitempty,string" form:"user_id"`
	Transactions []Transaction `json:"transactions,omitempty"`
}

type EditWallet struct {
	ID         uint    `json:"id,string"`
	Name       string  `json:"name"`
	Amount     float64 `json:"amount,string"`
	Icon       string  `json:"icon"`
	Color      string  `json:"color"`
	CurrencyID uint    `json:"currency_id,string" form:"currency_id"`
}

type ResponseWallet struct {
	ID         uint    `json:"id,string"`
	Name       string  `json:"name"`
	Amount     float64 `json:"amount,string"`
	Icon       string  `json:"icon"`
	Color      string  `json:"color"`
	CurrencyID uint    `json:"currency_id,string"`
	Symbol     string  `json:"symbol"`
}

type PieOfTypeWalletsItem struct {
	Amount   float64 `json:"amount"`
	WalletID uint    `json:"wallet_id"`
	Wallet   Wallet
}
