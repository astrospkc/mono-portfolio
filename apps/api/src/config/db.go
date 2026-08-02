package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// ConnectMongo initializes and returns a MongoDB client and database instance.
func ConnectMongo() (*mongo.Client, *mongo.Database, error) {
	envs := NewEnv()
	uri := envs.MONGO_URI
	if uri == "" {
		return nil, nil, fmt.Errorf("MONGO_URI is not set")
	}

	dbName := envs.MONGO_DB_NAME
	if dbName == "" {
		return nil, nil, fmt.Errorf("MONGO_DB_NAME is not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOpts := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(clientOpts)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create mongo client: %w", err)
	}

	// Ping the primary to verify connection
	if err := client.Ping(ctx, nil); err != nil {
		return nil, nil, fmt.Errorf("failed to ping mongo database: %w", err)
	}

	log.Println("Successfully connected to MongoDB database:", dbName)
	db := client.Database(dbName)
	return client, db, nil
}
