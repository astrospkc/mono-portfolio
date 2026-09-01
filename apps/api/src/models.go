package src

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Project represents a project item in MongoDB.
type Project struct {
	ID bson.ObjectID `bson:"_id,omitempty" json:"id"`

	ProjectID   string `bson:"project_id" json:"project_id"`
	Title       string `bson:"title" json:"title"`
	GithubLink  string `bson:"github_link" json:"github_link"`
	Image       string `bson:"image" json:"image"`
	Description string `bson:"description" json:"description"`
	DemoLink    string `bson:"demo_link" json:"demo_link"`

	StartDate  time.Time  `bson:"start_date" json:"start_date"`
	FinishDate *time.Time `bson:"finish_date,omitempty" json:"finish_date,omitempty"` // nil indicates ongoing project
	IsOngoing  bool       `bson:"is_ongoing" json:"is_ongoing"`
	CreatedAt  time.Time  `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time  `bson:"updated_at" json:"updated_at"`
}

// Blog represents a blog entry in MongoDB.
type Blog struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	BlogID      string        `bson:"blog_id" json:"blog_id"`
	Title       string        `bson:"title" json:"title"`
	Image       string        `bson:"image" json:"image"`
	Description string        `bson:"description" json:"description"`
	IsOngoing   bool          `bson:"is_ongoing" json:"is_ongoing"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

// Feed represents a feed item in MongoDB.
type Feed struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	FeedID    string        `bson:"feed_id" json:"feed_id"`
	UserID    bson.ObjectID `bson:"user_id" json:"user_id"`
	Title     string        `bson:"title" json:"title"`
	Content   string        `bson:"content" json:"content"`
	MediaURL  string        `bson:"media_url,omitempty" json:"media_url,omitempty"`
	IsOngoing bool          `bson:"is_ongoing" json:"is_ongoing"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

type Contact struct {
	ID bson.ObjectID `bson:"_id,omitempty" json:"id"`

	Name    string `bson:"name" json:"name"`
	Email   string `bson:"email" json:"email"`
	Message string `bson:"message" json:"message"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}
