package db

import "github.com/surrealdb/surrealdb.go/pkg/models"

const (
	DbOk = "OK"
)

var (
	globalSettingsMainRecord = models.RecordID{
		Table: "global_settings",
		ID:    "main",
	}
)
