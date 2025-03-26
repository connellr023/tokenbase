package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/utils"
)

type postRegistrationRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (i *Injection) PostRegistration(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req postRegistrationRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Register user in the DB
	user, err := db.RegisterUser(i.Sdb, req.Username, req.Email, req.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Convert user to client user
	clientUser, ok := user.ToClientUser()

	if !ok {
		http.Error(w, ErrInvalidID.Error(), http.StatusInternalServerError)
		return
	}

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
