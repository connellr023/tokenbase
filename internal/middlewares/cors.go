package middlewares

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func UseCorsMiddleware(router chi.Router) {
	corsCfg := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	router.Use(corsCfg.Handler)
}
