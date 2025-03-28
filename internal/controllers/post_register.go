package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/utils"
)

type postRegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (i *Injection) PostRegister(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req postRegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate account constraints
	if len(req.Password) < utils.MinPasswordLength || len(req.Username) < utils.MinUsernameLength || len(req.Username) > utils.MaxUsernameLength {
		http.Error(w, utils.ErrBadData.Error(), http.StatusBadRequest)
		return
	}

	// Register user in the DB
	user, err := db.RegisterUser(i.Sdb, req.Username, req.Email, req.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	clientUser := user.ToClientUser()

	// Generate token
	jwt, err := utils.GenerateJwt(clientUser)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send response (Can use postLoginResponse as this is the same functionality)
	res := postLoginResponse{
		Jwt:  jwt,
		User: clientUser,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
