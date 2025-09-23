package mw

import (
	"net/http"
	"os"
	"strings"
)

// CORS reads CORS_ALLOWED from env (comma-separated) and only allows those origins.
func CORS() func(http.Handler) http.Handler {
	allowed := strings.Split(os.Getenv("CORS_ALLOWED"), ",")
	for i := range allowed {
		allowed[i] = strings.TrimSpace(allowed[i])
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			for _, a := range allowed {
				if a != "" && strings.EqualFold(origin, a) {
					w.Header().Set("Access-Control-Allow-Origin", origin)
					w.Header().Set("Vary", "Origin")
					break
				}
			}
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
