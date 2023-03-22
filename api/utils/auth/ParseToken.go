package auth

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/tetroborat/expenses-webapp/config"
	"github.com/tetroborat/expenses-webapp/models"
)

func ParseToken(tokenString string) (claims *models.Claims, err error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.CFG.JwtSecret), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*models.Claims)
	if !ok {
		return nil, err
	}
	return claims, nil
}
