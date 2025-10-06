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

// ---------- config & helpers ----------
type money struct{ Currency, Value string }

var productCatalog = map[string]money{
	// edit/extend as you like
	"doc_small": {Currency: "CAD", Value: "5.00"},
	"doc_pro":   {Currency: "CAD", Value: "19.00"},
}

// maps product -> local file under /docs inside the container
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
	var out struct{ AccessToken string `json:"access_token"` }
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
		// stash for downstream handlers via headers (simple for MVP)
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

// ensure SQL table exists in Supabase:
//   create table if not exists entitlements(
//     user_id uuid not null,
//     product_id text not null,
//     granted_at timestamptz not null default now(),
//     primary key (user_id, product_id)
//   );

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

// pickStaticDir chooses a directory to serve for the web UI.
// Priority: STATIC_DIR env -> frontend/dist -> public -> current dir if index.html exists.
func pickStaticDir() string {
	candidates := []string{
		envOr("STATIC_DIR", ""),
		"frontend/dist",
		"public",
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
	return "" // no UI found; API-only
}

// spaHandler serves files from dir; if path doesn't exist, it serves index.html (SPA fallback).
// Any /api/* paths are left to other handlers (return 404 here so mux tries other routes).
func spaHandler(dir string) http.HandlerFunc {
	index := filepath.Join(dir, "index.html")
	return func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}
		// sanitize
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

	// Health
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	// Who am I (auth required)
	mux.HandleFunc("/api/whoami", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]string{
			"sub":   r.Header.Get("X-User-Sub"),
			"email": r.Header.Get("X-User-Email"),
		})
	}))

	// Create PayPal order for a *server-defined* product
	mux.HandleFunc("/api/payments/create-order", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			ProductID string `json:"productId"`
		}
		_ = json.NewDecoder(r.Body).Decode(&in)
		price, ok := productCatalog[in.ProductID]
		if !ok {
			http.Error(w, "unknown product", http.StatusBadRequest)
			return
		}

		access, err := paypalToken()
		if err != nil {
			http.Error(w, "paypal oauth: "+err.Error(), http.StatusBadGateway)
			return
		}

		payload := map[string]any{
			"intent": "CAPTURE",
			"purchase_units": []map[string]any{{
				"reference_id": in.ProductID,
				"amount": map[string]string{
					"currency_code": price.Currency,
					"value":         price.Value,
				},
			}},
			"application_context": map[string]string{
				"shipping_preference": "NO_SHIPPING",
				"brand_name":          "Justice-Bot",
				"user_action":         "PAY_NOW",
			},
		}

		b, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", paypalBase()+"/v2/checkout/orders", bytes.NewReader(b))
		req.Header.Set("Authorization", "Bearer "+access)
		req.Header.Set("Content-Type", "application/json")
		res, err := httpc.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer res.Body.Close()
		body, _ := io.ReadAll(res.Body)
		if res.StatusCode >= 300 {
			http.Error(w, fmt.Sprintf("paypal create %d: %s", res.StatusCode, string(body)), http.StatusBadGateway)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	}))

	// Capture order, verify amount, grant entitlement
	mux.HandleFunc("/api/payments/capture-order", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			OrderID   string `json:"orderId"`
			ProductID string `json:"productId"`
		}
		_ = json.NewDecoder(r.Body).Decode(&in)
		price, ok := productCatalog[in.ProductID]
		if !ok || in.OrderID == "" {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		access, err := paypalToken()
		if err != nil {
			http.Error(w, "paypal oauth: "+err.Error(), http.StatusBadGateway)
			return
		}

		req, _ := http.NewRequest("POST", paypalBase()+"/v2/checkout/orders/"+in.OrderID+"/capture", nil)
		req.Header.Set("Authorization", "Bearer "+access)
		req.Header.Set("Content-Type", "application/json")
		res, err := httpc.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer res.Body.Close()
		var out map[string]any
		if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
			http.Error(w, "paypal decode: "+err.Error(), http.StatusBadGateway)
			return
		}
		if res.StatusCode >= 300 {
			writeJSON(w, http.StatusBadGateway, out)
			return
		}

		// very basic verification (amount + COMPLETED)
		status, _ := out["status"].(string)
		if status != "COMPLETED" {
			writeJSON(w, http.StatusBadRequest, out)
			return
		}
		// dig amount from captures
		okAmount := false
		if pu, ok := out["purchase_units"].([]any); ok && len(pu) > 0 {
			x := pu[0].(map[string]any)
			payments, _ := x["payments"].(map[string]any)
			if caps, ok := payments["captures"].([]any); ok && len(caps) > 0 {
				amt := caps[0].(map[string]any)["amount"].(map[string]any)
				cur := amt["currency_code"].(string)
				val := amt["value"].(string)
				okAmount = (cur == price.Currency && val == price.Value)
			}
		}
		if !okAmount {
			http.Error(w, "amount mismatch", http.StatusBadRequest)
			return
		}

		// grant entitlement
		userID := r.Header.Get("X-User-Sub")
		if err := grantEntitlement(userID, in.ProductID); err != nil {
			http.Error(w, "entitlement: "+err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "order": out})
	}))

	// List entitlements for current user
	mux.HandleFunc("/api/entitlements", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-User-Sub")
		url := supaURL(fmt.Sprintf("/rest/v1/entitlements?user_id=eq.%s&select=product_id,granted_at", userID))
		req, _ := http.NewRequest("GET", url, nil)
		supaAuthHeaders(req.Header)
		res, err := httpc.Do(req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer res.Body.Close()
		if res.StatusCode >= 300 {
			b, _ := io.ReadAll(res.Body)
			http.Error(w, fmt.Sprintf("supabase %d: %s", res.StatusCode, string(b)), http.StatusBadGateway)
			return
		}
		io.Copy(w, res.Body)
	}))

	// Gated download: /api/docs/{slug}/download
	mux.HandleFunc("/api/docs/", requireSupabase(func(w http.ResponseWriter, r *http.Request) {
		// path: /api/docs/<slug>/download
		parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/docs/"), "/")
		if len(parts) != 2 || parts[1] != "download" {
			http.NotFound(w, r)
			return
		}
		slug := parts[0]

		// find which product unlocks this slug
		var productID, filename string
		for pid, fn := range productFile {
			if strings.TrimSuffix(fn, filepath.Ext(fn)) == slug {
				productID, filename = pid, fn
				break
			}
		}
		if productID == "" {
			http.NotFound(w, r)
			return
		}

		ok, err := hasEntitlement(r.Header.Get("X-User-Sub"), productID)
		if err != nil || !ok {
			http.Error(w, "no entitlement", http.StatusForbidden)
			return
		}

		// serve file from /docs inside container
		path := filepath.Join("/docs", filename)
		f, err := os.Open(path)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		defer f.Close()

		w.Header().Set("Content-Type", "application/pdf")
		w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, filename))
		io.Copy(w, f)
	}))

	// --- attach static UI last so /api/* stays owned by the API handlers ---
	if dir := pickStaticDir(); dir != "" {
		log.Printf("serving UI from %s (SPA)", dir)
		mux.HandleFunc("/", spaHandler(dir))
	} else {
		// no UI found; respond with a friendly message at /
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

	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
