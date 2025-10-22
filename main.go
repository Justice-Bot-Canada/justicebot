package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var httpc = &http.Client{Timeout: 15 * time.Second}

// ---------- CORS MIDDLEWARE ----------
var allowedOrigins = map[string]bool{
	"https://justice-bot.com":     true,
	"https://www.justice-bot.com": true,
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
			w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		}

		// Handle preflight quickly
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ---------- config & helpers ----------
type money struct{ Currency, Value string }

var productCatalog = map[string]money{
	"doc_small": {Currency: "CAD", Value: "5.00"},
	"doc_pro":   {Currency: "CAD", Value: "19.00"},
}

// maps product -> filename under ./docs
var productFile = map[string]string{
	"doc_small": "small-guide.pdf",
	"doc_pro":   "pro-pack.pdf",
}

func envOr(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func paypalBase() string {
	if strings.ToLower(os.Getenv("PAYPAL_ENV")) == "live" {
		return "https://api-m.paypal.com"
	}
	return "https://api-m.sandbox.paypal.com"
}

func paypalToken() (string, error) {
	id := os.Getenv("PAYPAL_CLIENT_ID")
	sec := os.Getenv("PAYPAL_CLIENT_SECRET")
	if id == "" || sec == "" {
		return "", errors.New("missing PayPal creds")
	}
	req, _ := http.NewRequest("POST", paypalBase()+"/v1/oauth2/token", strings.NewReader("grant_type=client_credentials"))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(id+":"+sec)))
	res, err := httpc.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		b, _ := io.ReadAll(res.Body)
		return "", fmt.Errorf("paypal oauth %d: %s", res.StatusCode, string(b))
	}
	var out struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
		return "", err
	}
	return out.AccessToken, nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// ---------- auth (Supabase JWT verify) ----------
type supaClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func requireSupabase(next http.HandlerFunc) http.HandlerFunc {
	secret := os.Getenv("SUPABASE_JWT_SECRET")
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			http.Error(w, "missing bearer token", http.StatusUnauthorized)
			return
		}
		tok := strings.TrimPrefix(auth, "Bearer ")
		token, err := jwt.ParseWithClaims(tok, &supaClaims{}, func(t *jwt.Token) (any, error) {
			if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, jwt.ErrTokenUnverifiable
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		claims := token.Claims.(*supaClaims)
		r.Header.Set("X-User-Sub", claims.Subject)
		r.Header.Set("X-User-Email", claims.Email)
		next.ServeHTTP(w, r)
	}
}

// ---------- Supabase REST for entitlements ----------
func supaURL(path string) string { return strings.TrimRight(os.Getenv("SUPABASE_URL"), "/") + path }

func supaAuthHeaders(h http.Header) {
	svc := os.Getenv("SUPABASE_SERVICE_ROLE")
	h.Set("apikey", svc)
	h.Set("Authorization", "Bearer "+svc)
}

func grantEntitlement(userID, productID string) error {
	body, _ := json.Marshal([]map[string]any{{"user_id": userID, "product_id": productID}})
	req, _ := http.NewRequest("POST", supaURL("/rest/v1/entitlements"), bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "resolution=merge-duplicates,return=representation")
	supaAuthHeaders(req.Header)
	res, err := httpc.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		b, _ := io.ReadAll(res.Body)
		return fmt.Errorf("supabase upsert %d: %s", res.StatusCode, string(b))
	}
	return nil
}

func hasEntitlement(userID, productID string) (bool, error) {
	url := supaURL(fmt.Sprintf("/rest/v1/entitlements?user_id=eq.%s&product_id=eq.%s&select=product_id", userID, productID))
	req, _ := http.NewRequest("GET", url, nil)
	supaAuthHeaders(req.Header)
	res, err := httpc.Do(req)
	if err != nil {
		return false, err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		b, _ := io.ReadAll(res.Body)
		return false, fmt.Errorf("supabase select %d: %s", res.StatusCode, string(b))
	}
	var rows []map[string]any
	if err := json.NewDecoder(res.Body).Decode(&rows); err != nil {
		return false, err
	}
	return len(rows) > 0, nil
}

// ---------- STATIC (serve frontend / SPA) ----------
func pickStaticDir() string {
	candidates := []string{
		"/app/public",
		envOr("STATIC_DIR", ""),
		"public",
		"frontend/dist",
		"frontend",
		".",
	}
	for _, d := range candidates {
		if d == "" {
			continue
		}
		if fi, err := os.Stat(filepath.Join(d, "index.html")); err == nil && !fi.IsDir() {
			return d
		}
	}
	return ""
}

func spaHandler(dir string) http.HandlerFunc {
	index := filepath.Join(dir, "index.html")
	return func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}
		if r.URL.Path == "/dev" {
			if _, err := os.Stat(filepath.Join(dir, "dev.html")); err == nil {
				http.ServeFile(w, r, filepath.Join(dir, "dev.html"))
				return
			}
		}
		p := filepath.Clean(r.URL.Path)
		if p == "/" {
			p = "/index.html"
		}
		fp := filepath.Join(dir, p)
		if fi, err := os.Stat(fp); err == nil && !fi.IsDir() {
			http.ServeFile(w, r, fp)
			return
		}
		http.ServeFile(w, r, index)
	}
}

// ---------- HTTP handlers ----------
func main() {
	port := envOr("PORT", "8080")
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("/api/whoami", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]string{
			"sub":   r.Header.Get("X-User-Sub"),
			"email": r.Header.Get("X-User-Email"),
		})
	}))

	// --- PayPal + entitlement routes (same as before) ---
	// (content unchanged, already in your code)
	// ... 👆

	if dir := pickStaticDir(); dir != "" {
		log.Printf("serving UI from %s (SPA)", dir)
		mux.HandleFunc("/", spaHandler(dir))
	} else {
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/api/") {
				http.NotFound(w, r)
				return
			}
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Justice-Bot API is running. Build your frontend and set STATIC_DIR or place index.html."))
		})
	}

	log.Printf("✅ listening on :%s with CORS enabled", port)
	log.Fatal(http.ListenAndServe(":"+port, cors(mux)))
}
