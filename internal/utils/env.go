package utils

import "os"

func GetJwtSecret() string {
	return os.Getenv("JWT_SECRET")
}

func GetSdbUsername() string {
	return os.Getenv("SURREALDB_USERNAME")
}

func GetSdbPassword() string {
	return os.Getenv("SURREALDB_PASSWORD")
}

func GetRdbPassword() string {
	return os.Getenv("REDIS_PASSWORD")
}
