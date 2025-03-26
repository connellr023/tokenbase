package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
)

// Validates a user's credentials
//
// Parameters:
// - sdb: SurrealDB client
// - email: User's email
// - password: User's password in plaintext
//
// Returns:
// - The user's data
// - Any error that occurred
func ValidateUserCredentials(sdb *surrealdb.DB, email string, password string) (models.DbUser, error) {
	const query = "SELECT * FROM users WHERE email = $email AND crypto::bcrypt::compare(password_hash, $password)"
	res, err := surrealdb.Query[[]models.DbUser](sdb, query, map[string]any{
		"email":    email,
		"password": password,
	})

	if err != nil {
		return models.DbUser{}, err
	}

	if len(*res) == 0 {
		return models.DbUser{}, ErrNoResults
	}

	data := (*res)[0]

	if len(data.Result) == 0 {
		return models.DbUser{}, ErrNoResults
	}

	if data.Status != DbOk {
		return models.DbUser{}, ErrQueryFailed
	}

	return data.Result[0], nil
}
