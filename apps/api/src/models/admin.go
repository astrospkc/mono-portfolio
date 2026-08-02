package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Admin represents an admin user in MongoDB.
type Admin struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string        `bson:"username" json:"username"`
	Password  string        `bson:"password" json:"password"` // Hashed password
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time     `bson:"updated_at" json:"updated_at"`
}
