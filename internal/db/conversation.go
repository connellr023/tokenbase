package db

import (
	"fmt"
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
	sdbModels "github.com/surrealdb/surrealdb.go/pkg/models"
)

func NewConversation(sdb *surrealdb.DB, name string, userID string) (models.DbConversation, error) {
	res, err := surrealdb.Create[models.DbConversation](sdb, sdbModels.Table("conversations"), map[string]any{
		"name":    name,
		"user_id": userID,
	})

	if err != nil {
		return models.DbConversation{}, err
	}

	if res == nil {
		return models.DbConversation{}, fmt.Errorf("failed to create conversation")
	}

	return *res, nil
}
