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
func RegisterUser(sdb *surrealdb.DB, username string, email string, password string) (string, error, error) { // return a token

	const query = "SELECT username FROM users WHERE username = $username"
	res_u, err := surrealdb.Query[[]models.DbUser](sdb, query, map[string]any{
		"username": username,
	})

	if err != nil {
		return "", err, nil
	}

	const query_2 = "SELECT email FROM users WHERE email = $email"
	res_e, err := surrealdb.Query[[]models.DbUser](sdb, query, map[string]any{
		"email": email,
	})

	if err != nil {
		return "", err, nil
	}

	if len(*res_e) != 0 && len(*res_u) != 0 {
		return "", ErrUsernameTaken, ErrEmailUsed
	}

	if len(*res_u) != 0 {
		return "", ErrUsernameTaken, nil
	}

	if len(*res_e) != 0 {
		return "", ErrEmailUsed, nil
	}

	user := map[string]any{
		"username": username,
		"email":    email,
		"password": password,
		"isAdmin":  false,
	}

	_, err = surrealdb.Insert[map[string]any](sdb, "users", user)

	if err != nil {
		return "", err, nil
	}

	token, err := utils.GenerateJwt(user)

	return token
}
