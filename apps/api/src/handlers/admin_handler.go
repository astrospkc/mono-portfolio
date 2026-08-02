package handlers

import (
	"context"
	"fmt"
	"log"
	"mono_portfolio/apps/api/src/config"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

// AdminHandler handles Register and Login authentication operations for admins.
type AdminHandler struct {
	collection *mongo.Collection
}

// NewAdminHandler creates a new instance of AdminHandler.
func NewAdminHandler(db *mongo.Database) *AdminHandler {
	return &AdminHandler{
		collection: db.Collection("admins"),
	}
}

// AuthDTO defines the request payload for Register and Login endpoints.
type AuthDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Register handles POST /api/admin/register
func (h *AdminHandler) Register(c fiber.Ctx) error {

	var dto AuthDTO
	fmt.Println("Hello  hi ", dto)
	if err := c.Bind().Body(&dto); err != nil || dto.Username == "" || dto.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}

	log.Println("body: ", dto)
	// Check if username already exists
	var existing bson.M
	err := h.collection.FindOne(context.Background(), bson.M{"username": dto.Username}).Decode(&existing)
	if err == nil {
		return c.Status(http.StatusConflict).JSON(fiber.Map{
			"error": "Username already exists",
		})
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process password",
		})
	}

	now := time.Now()
	adminDoc := bson.M{
		"username":   dto.Username,
		"password":   string(hashedPassword),
		"created_at": now,
		"updated_at": now,
	}

	res, err := h.collection.InsertOne(context.Background(), adminDoc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create admin: " + err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "Admin registered successfully",
		"id":      res.InsertedID,
	})
}

// Login handles POST /api/admin/login
func (h *AdminHandler) Login(c fiber.Ctx) error {
	var dto AuthDTO
	if err := c.Bind().Body(&dto); err != nil || dto.Username == "" || dto.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}

	var admin bson.M
	err := h.collection.FindOne(context.Background(), bson.M{"username": dto.Username}).Decode(&admin)
	if err == mongo.ErrNoDocuments {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	} else if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error: " + err.Error(),
		})
	}

	storedPassword, _ := admin["password"].(string)
	if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(dto.Password)); err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}
	envs := config.NewEnv()

	jwtSecret := envs.JWT_SECRET
	if jwtSecret == "" {
		jwtSecret = "default_secret_key"
	}

	claims := jwt.MapClaims{
		"admin_id": admin["_id"],
		"username": admin["username"],
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate JWT token",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"token":   tokenString,
	})
}
