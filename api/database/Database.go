package database

import (
	"fmt"
	"github.com/tetroborat/expenses-webapp/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
)

var DB *gorm.DB

func ConnectDB() {
	cfg := config.CFG
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBUserPassword, cfg.DBName, cfg.DBPort, cfg.DbSslMode, cfg.DbTimeZone,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}
	log.Println("connected")
	db.Logger = logger.Default.LogMode(logger.Info)
	DB = db
}
