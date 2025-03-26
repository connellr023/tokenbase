package db

import (
	"tokenbase/internal/models"
	"tokenbase/internal/utils"

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

// Inserts a newly registered user's credentials into the DB
//
// Parameters:
// - sdb: SurrealDB client
// - username: User's username
// - email: User's email
// - password: User's password in plaintext
// Returns:
// - token: A JWT token of the user's login
// - Any error that occurred
func RegisterUser(sdb *surrealdb.DB, username string, email string, password string) (string, error) {

	user := map[string]any{
		"username": username,
		"email":    email,
		"password_hash": map[string]any{
			"function": "crypto::bcrypt::hash",
			"args":     []any{password},
		},
		"isAdmin": false,
	}

	res, err := surrealdb.Create[models.DbUser](sdb, "users", user)

	if err != nil {
		return "", err
	}

	if res == nil {
		return "", ErrFailedCreateUser
	}

	client, _ := res.ToClientUser()
	token, err := utils.GenerateJwt(client)

	if err != nil {
		return "", err
	}

	return token, nil
}
