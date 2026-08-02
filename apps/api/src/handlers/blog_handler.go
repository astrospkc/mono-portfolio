package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// BlogHandler handles CRUD operations for Blogs.
type BlogHandler struct {
	collection *mongo.Collection
}

// NewBlogHandler creates a new instance of BlogHandler.
func NewBlogHandler(db *mongo.Database) *BlogHandler {
	return &BlogHandler{
		collection: db.Collection("blogs"),
	}
}

// CreateBlogDTO defines the payload for creating a Blog.
type CreateBlogDTO struct {
	BlogID      string `json:"blog_id"`
	Title       string `json:"title"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

// UpdateBlogDTO defines the payload for full/partial updates.
type UpdateBlogDTO struct {
	BlogID      *string `json:"blog_id,omitempty"`
	Title       *string `json:"title,omitempty"`
	Image       *string `json:"image,omitempty"`
	Description *string `json:"description,omitempty"`
}

// Create handles POST /blogs
func (h *BlogHandler) Create(c fiber.Ctx) error {
	var dto CreateBlogDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	now := time.Now()
	doc := bson.M{
		"blog_id":     dto.BlogID,
		"title":       dto.Title,
		"image":       dto.Image,
		"description": dto.Description,
		"created_at":  now,
		"updated_at":  now,
	}

	res, err := h.collection.InsertOne(context.Background(), doc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create blog: " + err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "Blog created successfully",
		"id":      res.InsertedID,
	})
}

// GetAll handles GET /blogs
func (h *BlogHandler) GetAll(c fiber.Ctx) error {
	cursor, err := h.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch blogs: " + err.Error(),
		})
	}
	defer cursor.Close(context.Background())

	var blogs []bson.M
	if err := cursor.All(context.Background(), &blogs); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to parse blogs: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(blogs)
}

// GetByID handles GET /blogs/:id
func (h *BlogHandler) GetByID(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog ID format",
		})
	}

	var blog bson.M
	err = h.collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&blog)
	if err == mongo.ErrNoDocuments {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Blog not found",
		})
	} else if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch blog: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(blog)
}

// Update handles PUT /blogs/:id (Replace/Full Update)
func (h *BlogHandler) Update(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog ID format",
		})
	}

	var dto CreateBlogDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updateDoc := bson.M{
		"$set": bson.M{
			"blog_id":     dto.BlogID,
			"title":       dto.Title,
			"image":       dto.Image,
			"description": dto.Description,
			"updated_at":  time.Now(),
		},
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, updateDoc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update blog: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Blog not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Blog updated successfully",
	})
}

// Patch handles PATCH /blogs/:id (Partial Update)
func (h *BlogHandler) Patch(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog ID format",
		})
	}

	var dto UpdateBlogDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updates := bson.M{
		"updated_at": time.Now(),
	}

	if dto.BlogID != nil {
		updates["blog_id"] = *dto.BlogID
	}
	if dto.Title != nil {
		updates["title"] = *dto.Title
	}
	if dto.Image != nil {
		updates["image"] = *dto.Image
	}
	if dto.Description != nil {
		updates["description"] = *dto.Description
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": updates})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to patch blog: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Blog not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Blog patched successfully",
	})
}

// Delete handles DELETE /blogs/:id
func (h *BlogHandler) Delete(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog ID format",
		})
	}

	res, err := h.collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete blog: " + err.Error(),
		})
	}
	if res.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Blog not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Blog deleted successfully",
	})
}
