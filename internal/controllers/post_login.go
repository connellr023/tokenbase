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

	// Validate user credentials
	user, err := db.ValidateUserCredentials(i.Sdb, req.Email, req.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Convert user to client user
	clientUser, ok := user.ToClientUser()

	if !ok {
		http.Error(w, ErrInvalidUserID.Error(), http.StatusInternalServerError)
		return
	}

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
	json.NewEncoder(w).Encode(res)
}
