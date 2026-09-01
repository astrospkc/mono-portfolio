package src

import (
	"time"

	"mono_portfolio/apps/api/src/handlers"
	"mono_portfolio/apps/api/src/middleware"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// SetupRoutes initializes API routes on the Fiber app instance.
func SetupRoutes(app *fiber.App, db *mongo.Database) {
	api := app.Group("/api")

	// Admin Routes
	adminHandler := handlers.NewAdminHandler(db)
	admin := api.Group("/admin")
	admin.Post("/register", adminHandler.Register)
	admin.Post("/login", adminHandler.Login)

	// Initialize Project Handler
	projectHandler := handlers.NewProjectHandler(db)

	// Project Routes (Protected by AdminAuthMiddleware for mutation)
	projects := api.Group("/projects")
	projects.Post("/", middleware.AdminAuthMiddleware(), projectHandler.Create)
	projects.Get("/", projectHandler.GetAll)
	projects.Get("/:id", projectHandler.GetByID)
	projects.Put("/:id", middleware.AdminAuthMiddleware(), projectHandler.Update)
	projects.Patch("/:id", middleware.AdminAuthMiddleware(), projectHandler.Patch)
	projects.Delete("/:id", middleware.AdminAuthMiddleware(), projectHandler.Delete)

	// Initialize Blog Handler
	blogHandler := handlers.NewBlogHandler(db)

	// Blog Routes
	blogs := api.Group("/blogs")
	blogs.Post("/", middleware.AdminAuthMiddleware(), blogHandler.Create)
	blogs.Get("/", blogHandler.GetAll)
	blogs.Get("/:id", blogHandler.GetByID)
	blogs.Put("/:id", middleware.AdminAuthMiddleware(), blogHandler.Update)
	blogs.Patch("/:id", middleware.AdminAuthMiddleware(), blogHandler.Patch)
	blogs.Delete("/:id", middleware.AdminAuthMiddleware(), blogHandler.Delete)

	// Initialize Feed Handler
	feedHandler := handlers.NewFeedHandler(db)

	// Feed Routes
	feeds := api.Group("/feeds")
	feeds.Post("/", middleware.AdminAuthMiddleware(), feedHandler.Create)
	feeds.Get("/", feedHandler.GetAll)
	feeds.Get("/:id", feedHandler.GetByID)
	feeds.Put("/:id", middleware.AdminAuthMiddleware(), feedHandler.Update)
	feeds.Patch("/:id", middleware.AdminAuthMiddleware(), feedHandler.Patch)
	feeds.Delete("/:id", middleware.AdminAuthMiddleware(), feedHandler.Delete)

	// Contact Limiter: Max 3 emails per 15 minutes per IP address
	contactLimiter := limiter.New(limiter.Config{
		Max:        3,
		Expiration: 15 * time.Minute,
		LimitReached: func(c fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"success": false,
				"message": "Too many requests. Please try again after 15 minutes.",
			})
		},
	})

	contact := api.Group("/contact")
	contact.Post("/", contactLimiter, handlers.SendContactEmail)
}
