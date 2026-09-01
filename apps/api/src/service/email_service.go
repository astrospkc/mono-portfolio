package service

import (
	"log"
	"mono_portfolio/apps/api/src/config"

	"github.com/resend/resend-go/v4"
)

var EmailClient *resend.Client

// InitEmailClient initializes the global Resend email client
func InitEmailClient() {
	env := config.NewEnv()
	if env.RESEND_API_KEY == "" {
		log.Println("Warning: RESEND_API_KEY is not set. Email service disabled.")
		return
	}
	EmailClient = resend.NewClient(env.RESEND_API_KEY)
	log.Println("EmailClient initialized successfully")
}
