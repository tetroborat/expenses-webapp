package models

import (
	"gorm.io/gorm"
	"time"
)

type User struct {
	gorm.Model
	Name       string   `json:"name"`
	Email      string   `gorm:"unique" json:"email"`
	Password   string   `json:"password"`
	Role       string   `json:"role"`
	Currency   Currency `json:"currency,omitempty" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL; ForeignKey:CurrencyID"`
	CurrencyID uint     `json:"currency_id,omitempty,string" form:"currency_id" gorm:"default:"`
}

type RegisteringUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserInfo struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Currency  Currency  `json:"currency"`
}

func FilterUserRecord(user *User) UserInfo {
	return UserInfo{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Currency:  user.Currency,
	}
}

type EditUser struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	CurrencyID uint   `json:"currency_id,string" form:"currency_id"`
}
