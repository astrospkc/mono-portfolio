package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// FeedHandler handles CRUD operations for Feeds.
type FeedHandler struct {
	collection *mongo.Collection
}

// NewFeedHandler creates a new instance of FeedHandler.
func NewFeedHandler(db *mongo.Database) *FeedHandler {
	return &FeedHandler{
		collection: db.Collection("feeds"),
	}
}

// CreateFeedDTO defines the payload for creating a Feed.
type CreateFeedDTO struct {
	FeedID   string `json:"feed_id"`
	Content  string `json:"content"`
	Category string `json:"category"`
	Image    string `json:"image"`
}

// UpdateFeedDTO defines the payload for updates.
type UpdateFeedDTO struct {
	FeedID   *string `json:"feed_id,omitempty"`
	Content  *string `json:"content,omitempty"`
	Category *string `json:"category,omitempty"`
	Image    *string `json:"image,omitempty"`
}

// Create handles POST /feeds
func (h *FeedHandler) Create(c fiber.Ctx) error {
	var dto CreateFeedDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	now := time.Now()
	doc := bson.M{
		"feed_id":    dto.FeedID,
		"content":    dto.Content,
		"category":   dto.Category,
		"image":      dto.Image,
		"created_at": now,
		"updated_at": now,
	}

	res, err := h.collection.InsertOne(context.Background(), doc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create feed: " + err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "Feed created successfully",
		"id":      res.InsertedID,
	})
}

// GetAll handles GET /feeds
func (h *FeedHandler) GetAll(c fiber.Ctx) error {
	cursor, err := h.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch feeds: " + err.Error(),
		})
	}
	defer cursor.Close(context.Background())

	var feeds []bson.M
	if err := cursor.All(context.Background(), &feeds); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to parse feeds: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(feeds)
}

// GetByID handles GET /feeds/:id
func (h *FeedHandler) GetByID(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid feed ID format",
		})
	}

	var feed bson.M
	err = h.collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&feed)
	if err == mongo.ErrNoDocuments {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Feed not found",
		})
	} else if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch feed: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(feed)
}

// Update handles PUT /feeds/:id (Replace/Full Update)
func (h *FeedHandler) Update(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid feed ID format",
		})
	}

	var dto CreateFeedDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updateDoc := bson.M{
		"$set": bson.M{
			"feed_id":    dto.FeedID,
			"content":    dto.Content,
			"category":   dto.Category,
			"image":      dto.Image,
			"updated_at": time.Now(),
		},
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, updateDoc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update feed: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Feed not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Feed updated successfully",
	})
}

// Patch handles PATCH /feeds/:id (Partial Update)
func (h *FeedHandler) Patch(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid feed ID format",
		})
	}

	var dto UpdateFeedDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updates := bson.M{
		"updated_at": time.Now(),
	}

	if dto.FeedID != nil {
		updates["feed_id"] = *dto.FeedID
	}
	if dto.Content != nil {
		updates["content"] = *dto.Content
	}
	if dto.Category != nil {
		updates["category"] = *dto.Category
	}
	if dto.Image != nil {
		updates["image"] = *dto.Image
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": updates})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to patch feed: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Feed not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Feed patched successfully",
	})
}

// Delete handles DELETE /feeds/:id
func (h *FeedHandler) Delete(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid feed ID format",
		})
	}

	res, err := h.collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete feed: " + err.Error(),
		})
	}
	if res.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Feed not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Feed deleted successfully",
	})
}
