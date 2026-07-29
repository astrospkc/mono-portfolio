package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// ProjectHandler handles CRUD operations for Projects.
type ProjectHandler struct {
	collection *mongo.Collection
}

// NewProjectHandler creates a new instance of ProjectHandler.
func NewProjectHandler(db *mongo.Database) *ProjectHandler {
	return &ProjectHandler{
		collection: db.Collection("projects"),
	}
}

// CreateProjectDTO defines the payload for creating a Project.
type CreateProjectDTO struct {
	ProjectID   string     `json:"project_id"`
	GithubLink  string     `json:"github_link"`
	Image       string     `json:"image"`
	Description string     `json:"description"`
	DemoLink    string     `json:"demo_link"`
	StartDate   time.Time  `json:"start_date"`
	FinishDate  *time.Time `json:"finish_date,omitempty"`
	IsOngoing   bool       `json:"is_ongoing"`
}

// UpdateProjectDTO defines the payload for full/partial updates.
type UpdateProjectDTO struct {
	GithubLink  *string    `json:"github_link,omitempty"`
	Image       *string    `json:"image,omitempty"`
	Description *string    `json:"description,omitempty"`
	DemoLink    *string    `json:"demo_link,omitempty"`
	StartDate   *time.Time `json:"start_date,omitempty"`
	FinishDate  *time.Time `json:"finish_date,omitempty"`
	IsOngoing   *bool      `json:"is_ongoing,omitempty"`
}

// Create handles POST /projects
func (h *ProjectHandler) Create(c fiber.Ctx) error {
	var dto CreateProjectDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	now := time.Now()
	doc := bson.M{

		"project_id":  dto.ProjectID,
		"github_link": dto.GithubLink,
		"image":       dto.Image,
		"description": dto.Description,
		"demo_link":   dto.DemoLink,
		"start_date":  dto.StartDate,
		"finish_date": dto.FinishDate,
		"is_ongoing":  dto.IsOngoing,
		"created_at":  now,
		"updated_at":  now,
	}

	res, err := h.collection.InsertOne(context.Background(), doc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create project: " + err.Error(),
		})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": "Project created successfully",
		"id":      res.InsertedID,
	})
}

// GetAll handles GET /projects
func (h *ProjectHandler) GetAll(c fiber.Ctx) error {
	cursor, err := h.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch projects: " + err.Error(),
		})
	}
	defer cursor.Close(context.Background())

	var projects []bson.M
	if err := cursor.All(context.Background(), &projects); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to parse projects: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(projects)
}

// GetByID handles GET /projects/:id
func (h *ProjectHandler) GetByID(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	var project bson.M
	err = h.collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&project)
	if err == mongo.ErrNoDocuments {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	} else if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch project: " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(project)
}

// Update handles PUT /projects/:id (Replace/Full Update)
func (h *ProjectHandler) Update(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	var dto CreateProjectDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updateDoc := bson.M{
		"$set": bson.M{

			"project_id":  dto.ProjectID,
			"github_link": dto.GithubLink,
			"image":       dto.Image,
			"description": dto.Description,
			"demo_link":   dto.DemoLink,
			"start_date":  dto.StartDate,
			"finish_date": dto.FinishDate,
			"is_ongoing":  dto.IsOngoing,
			"updated_at":  time.Now(),
		},
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, updateDoc)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Project updated successfully",
	})
}

// Patch handles PATCH /projects/:id (Partial Update)
func (h *ProjectHandler) Patch(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	var dto UpdateProjectDTO
	if err := c.Bind().Body(&dto); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body: " + err.Error(),
		})
	}

	updates := bson.M{
		"updated_at": time.Now(),
	}

	if dto.GithubLink != nil {
		updates["github_link"] = *dto.GithubLink
	}
	if dto.Image != nil {
		updates["image"] = *dto.Image
	}
	if dto.Description != nil {
		updates["description"] = *dto.Description
	}
	if dto.DemoLink != nil {
		updates["demo_link"] = *dto.DemoLink
	}
	if dto.StartDate != nil {
		updates["start_date"] = *dto.StartDate
	}
	if dto.FinishDate != nil {
		updates["finish_date"] = dto.FinishDate
	}
	if dto.IsOngoing != nil {
		updates["is_ongoing"] = *dto.IsOngoing
	}

	res, err := h.collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": updates})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to patch project: " + err.Error(),
		})
	}
	if res.MatchedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Project patched successfully",
	})
}

// Delete handles DELETE /projects/:id
func (h *ProjectHandler) Delete(c fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := bson.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	res, err := h.collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project: " + err.Error(),
		})
	}
	if res.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}
