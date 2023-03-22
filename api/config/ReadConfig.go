package config

import (
	"log"
	"time"
)
import "github.com/spf13/viper"

var CFG Config

type Config struct {
	DBHost         string `mapstructure:"DB_HOST"`
	DBUser         string `mapstructure:"DB_USER"`
	DBUserPassword string `mapstructure:"DB_PASSWORD"`
	DBName         string `mapstructure:"DB_NAME"`
	DBPort         string `mapstructure:"DB_PORT"`
	DbSslMode      string `mapstructure:"DB_SSL_MODE"`
	DbTimeZone     string `mapstructure:"DB_TIME_ZONE"`

	JwtSecret    string        `mapstructure:"JWT_SECRET"`
	JwtExpiresIn time.Duration `mapstructure:"JWT_EXPIRED_IN"`
	JwtMaxAge    int           `mapstructure:"JWT_MAXAGE"`

	CurRateApikey string `mapstructure:"CUR_RATE_APIKEY"`
}

func LoadConfig(path string) {
	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("api")
	viper.AutomaticEnv()
	err := viper.ReadInConfig()
	if err != nil {
		return
	}
	err = viper.Unmarshal(&CFG)
	if err != nil {
		log.Fatalln("Failed to load environment variables! \n", err.Error())
	}
}
