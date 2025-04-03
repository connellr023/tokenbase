package models

type ClientUser struct {
	ID        string `json:"id"        mapstructure:"id"`
	Username  string `json:"username"  mapstructure:"username"`
	Email     string `json:"email"     mapstructure:"email"`
	IsAdmin   bool   `json:"isAdmin"   mapstructure:"isAdmin"`
	CreatedAt int64  `json:"createdAt" mapstructure:"createdAt"`
}
