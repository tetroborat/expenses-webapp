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
	ID        uint      `json:"id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Email     string    `json:"email,omitempty"`
	Role      string    `json:"role,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Currency  Currency  `json:"currency,omitempty"`
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
