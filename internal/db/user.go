package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Validates a user's credentials.
//
// Parameters:
// - sdb: SurrealDB client.
// - email: User's email.
// - password: User's password in plaintext.
//
// Returns:
// - The user's data.
// - Any error that occurred.
func ValidateUserCredentials(sdb *surrealdb.DB, email string, password string) (models.DbUser, error) {
	const query = `
		SELECT * 
		FROM users 
		WHERE email = $email 
		AND crypto::bcrypt::compare(password_hash, $password)
	`

	res, err := surrealdb.Query[[]models.DbUser](sdb, query, map[string]any{
		"email":    email,
		"password": password,
	})

	if err != nil {
		return models.DbUser{}, err
	}

	var user models.DbUser
	err = validateSingleQueryResult(res, &user)

	return user, err
}

// Inserts a newly registered user's credentials into the DB.
//
// Parameters:
// - sdb: SurrealDB client.
// - username: User's username.
// - email: User's email.
// - password: User's password in plaintext.
//
// Returns:
// - token: A JWT token of the user's login.
// - Any error that occurred.
func RegisterUser(sdb *surrealdb.DB, username string, email string, password string) (models.DbUser, error) {
	const query = "INSERT INTO users (username, email, password_hash, is_admin) VALUES ($username, $email, crypto::bcrypt::generate($password), $is_admin) RETURN AFTER"
	res, err := surrealdb.Query[[]models.DbUser](sdb, query, map[string]any{
		"username": username,
		"email":    email,
		"password": password,
		"is_admin": false,
	})

	if err != nil {
		return models.DbUser{}, err
	}

	var user models.DbUser
	err = validateSingleQueryResult(res, &user)

	return user, err
}
