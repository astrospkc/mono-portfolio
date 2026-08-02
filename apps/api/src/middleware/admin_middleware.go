package middleware

import (
	"fmt"
	"mono_portfolio/apps/api/src/config"
	"net/http"

	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// AdminAuthMiddleware validates the JWT token passed in the Authorization header.
func AdminAuthMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		envs := config.NewEnv()
		jwtSecret := envs.JWT_SECRET
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header missing",
			})
		}

		// Token format expected: "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid Authorization header format. Expected 'Bearer <token>'",
			})
		}

		tokenString := parts[1]

		if jwtSecret == "" {
			jwtSecret = "default_secret_key"
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token -" + err.Error(),
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}

		// Store admin information in fiber context for downstream handlers
		c.Locals("admin_id", claims["admin_id"])
		c.Locals("username", claims["username"])

		return c.Next()
	}
}
