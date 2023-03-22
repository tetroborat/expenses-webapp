package models

import "gorm.io/gorm"

type Currency struct {
	gorm.Model
	Name    string `json:"name,omitempty" gorm:"uniqueIndex"`
	Symbol  string `json:"symbol,omitempty"`
	ISOCode string `json:"iso_code,omitempty" gorm:"uniqueIndex"`
}

type ResponseCurrency struct {
	ID      uint   `json:"id,omitempty"`
	Name    string `json:"name,omitempty"`
	Symbol  string `json:"symbol,omitempty"`
	ISOCode string `json:"iso_code,omitempty"`
}
