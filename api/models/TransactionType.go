package models

import (
	"gorm.io/gorm"
)

type TransactionType struct {
	gorm.Model
	Name   string `json:"name,omitempty"`
	Adding bool   `json:"adding,omitempty"`
	Icon   string `json:"icon,omitempty"`
	Color  string `json:"color,omitempty"`
	User   User   `json:"user,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:UserID"`
	UserID uint   `json:"user_id,omitempty,string" form:"user_id"`
	Weight int    `json:"weight,omitempty,string"`
}

type EditTransactionType struct {
	ID     uint   `json:"id,string"`
	Name   string `json:"name"`
	Adding bool   `json:"adding"`
	Icon   string `json:"icon"`
	Color  string `json:"color"`
}

type ResponseTransactionType struct {
	ID     uint    `json:"id,string"`
	Name   string  `json:"name"`
	Adding bool    `json:"adding"`
	Icon   string  `json:"icon"`
	Color  string  `json:"color"`
	Amount float64 `json:"amount,string"`
}

type PieOfWalletTypesItem struct {
	Amount float64 `json:"amount"`
	TypeID uint    `json:"type_id"`
	Type   TransactionType
}

type TransactionTypeForTransaction EditTransactionType
