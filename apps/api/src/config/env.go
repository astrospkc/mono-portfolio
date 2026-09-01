package config

import (
	"log"

	"github.com/spf13/viper"
)

type ENV struct {
	MONGO_URI         string `mapstructure:"MONGO_URI"`
	MONGO_DB_NAME     string `mapstructure:"MONGO_DB_NAME"`
	JWT_SECRET        string `mapstructure:"JWT_SECRET"`
	RESEND_API_KEY    string `mapstructure:"RESEND_API_KEY"`
	MY_PERSONAL_EMAIL string `mapstructure:"MY_PERSONAL_EMAIL"`
}

func NewEnv() *ENV {
	env := ENV{}
	viper.SetConfigFile(".env")

	err := viper.ReadInConfig()
	if err != nil {
		log.Println("Note: Can't find or read .env file, falling back to OS environment variables:", err)
	}

	// AutomaticEnv allows reading directly from system OS environment variables if set
	viper.AutomaticEnv()

	err = viper.Unmarshal(&env)
	if err != nil {
		log.Println("Warning: Could not unmarshal env config:", err)
	}

	return &env
}
