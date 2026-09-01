package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"mono_portfolio/apps/api/src"
	"mono_portfolio/apps/api/src/config"
	"mono_portfolio/apps/api/src/service"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Uptime    string    `json:"uptime"`
	Service   string    `json:"service"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

var startTime = time.Now()

func main() {
	// Initialize Resend Email Service Client
	service.InitEmailClient()

	// Connect to MongoDB
	client, db, err := config.ConnectMongo()
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting MongoDB client: %v", err)
		}
	}()

	app := fiber.New(fiber.Config{
		AppName: "Mono Portfolio Go Fiber v3 API",
	})

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"https://mono-portfolio-web.vercel.app", "https://punam.xastros.site", "http://localhost:3000"},
		AllowHeaders: []string{"Origin, Content-Type, Accept, Authorization"},
		AllowMethods: []string{"GET, POST, HEAD, PUT, DELETE, PATCH, OPTIONS"},
	}))

	// Setup application routes
	src.SetupRoutes(app, db)

	// Health endpoint
	app.Get("/api/health", func(c fiber.Ctx) error {
		return c.JSON(HealthResponse{
			Status:    "ok",
			Timestamp: time.Now(),
			Uptime:    time.Since(startTime).Round(time.Second).String(),
			Service:   "Golang (GoFiber v3) API",
		})
	})

	// Hello endpoint
	app.Get("/api/hello", func(c fiber.Ctx) error {
		return c.JSON(MessageResponse{
			Message: "Hello from GoFiber v3 backend running inside Turborepo monorepo!",
		})
	})

	port := ":8000"
	fmt.Printf("🚀 GoFiber v3 API server running on http://localhost%s\n", port)
	log.Fatal(app.Listen(port))
}
