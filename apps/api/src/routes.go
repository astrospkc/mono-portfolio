package src

import (
	"mono_portfolio/apps/api/src/handlers"

	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// SetupRoutes initializes API routes on the Fiber app instance.
func SetupRoutes(app *fiber.App, db *mongo.Database) {
	api := app.Group("/api")

	// Initialize Project Handler
	projectHandler := handlers.NewProjectHandler(db)

	// Project Routes
	projects := api.Group("/projects")
	projects.Post("/", projectHandler.Create)
	projects.Get("/", projectHandler.GetAll)
	projects.Get("/:id", projectHandler.GetByID)
	projects.Put("/:id", projectHandler.Update)
	projects.Patch("/:id", projectHandler.Patch)
	projects.Delete("/:id", projectHandler.Delete)
}
