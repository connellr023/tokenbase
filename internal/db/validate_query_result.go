package db

import (
	"tokenbase/internal/utils"

	"github.com/surrealdb/surrealdb.go"
)

// Check if a SurrealDB query result for a single item was successful and contains data.
//
// Parameters:
// - result: A pointer to a slice of SurrealDB query results.
// - out: A pointer to a variable of type T where the result will be stored.
//
// Returns:
// - An error if the query failed or if there are no results.
// - If out is not nil, it will be populated with the first result.
func ValidateSingleQueryResult[T any](result *[]surrealdb.QueryResult[[]T], out *T) error {
	if result == nil || len(*result) == 0 {
		return utils.ErrQueryFailed
	}

	data := (*result)[0].Result

	if len(data) == 0 {
		return utils.ErrNoResults
	}

	if len(data) > 1 {
		return utils.ErrTooManyResults
	}

	if out != nil {
		*out = data[0]
	}

	return nil
}

// Check if a SurrealDB query result for an array was successful and contains data.
//
// Parameters:
// - result: A pointer to a slice of SurrealDB query results.
//
// Returns:
// - A slice of type T containing the data from the query result.
// - An error if the query failed or if there are no results.
func ValidateArrayQueryResult[T any](result *[]surrealdb.QueryResult[[]T]) ([]T, error) {
	if result == nil || len(*result) == 0 {
		return nil, utils.ErrQueryFailed
	}

	data := (*result)[0].Result

	if len(data) == 0 {
		return nil, utils.ErrNoResults
	}

	return data, nil
}
