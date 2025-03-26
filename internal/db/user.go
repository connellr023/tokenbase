package db

import (
	"tokenbase/internal/models"

	"github.com/surrealdb/surrealdb.go"
	"golang.org/x/crypto/bcrypt"
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

// Inserts a newly registered user's credentials into the DB
//
// Parameters:
// - sdb: SurrealDB client
// - username: User's username
// - email: User's email
// - password: User's password in plaintext
//
// Returns:
// - token: A JWT token of the user's login
// - Any error that occurred
func RegisterUser(sdb *surrealdb.DB, username string, email string, password string) (models.DbUser, error) {

	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	password_hash := string(bytes)

	if err != nil {
		return models.DbUser{}, err
	}

	user := map[string]any{
		"username":      username,
		"email":         email,
		"password_hash": password_hash,
		"is_admin":      false,
	}

	res, err := surrealdb.Create[models.DbUser](sdb, "users", user)

	if err != nil {
		return models.DbUser{}, err
	}

	if res == nil {
		return models.DbUser{}, ErrFailedCreateUser
	}

	return *res, nil
}
