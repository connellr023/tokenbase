package controllers

import (
	"encoding/json"
	"net/http"
	"tokenbase/internal/db"
	"tokenbase/internal/models"
	"tokenbase/internal/utils"
)

type postLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type postLoginResponse struct {
	Jwt  string            `json:"jwt"`
	User models.ClientUser `json:"user"`
}

func (i *Injection) PostLogin(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req postLoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate dbUser credentials
	dbUser, err := db.ValidateUserCredentials(i.Sdb, req.Email, req.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	clientUser := dbUser.ToClientUser()

	// Generate token
	jwt, err := utils.GenerateJwt(clientUser)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Send response
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
