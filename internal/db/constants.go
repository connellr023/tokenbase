package db

import "github.com/surrealdb/surrealdb.go/pkg/models"

var (
	globalSettingsMainRecord = models.RecordID{
		Table: "global_settings",
		ID:    "main",
	}
)
