package config

import (
	"log"

	"github.com/spf13/viper"
)

type ENV struct {
	MONGO_URI     string `mapstructure:"MONGO_URI"`
	MONGO_DB_NAME string `mapstructure:"MONGO_DB_NAME"`
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
