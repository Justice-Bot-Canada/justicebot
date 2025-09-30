package handlers


import (
"encoding/json"
"net/http"
"strings"


"github.com/Justice-Bot-Canada/plain-justice-go/services"
moduleTypes "github.com/Justice-Bot-Canada/plain-justice-go/types"
)


type MeritRequest struct {
// Extend to match your existing payload
Province string `json:"province"`
Venue string `json:"venue"`
Issue string `json:"issue"`
}


type MeritResponse struct {
Score float64 `json:"score"`
Journey moduleTypes.LegalJourney `json:"journey"`
}


// GET/POST handler that ALWAYS returns a non-empty journey.
func GetMerit(w http.ResponseWriter, r *http.Request) {
// Parse optional JSON body if provided
var req MeritRequest
_ = json.NewDecoder(r.Body).Decode(&req)


province := firstNonEmpty(strings.ToUpper(req.Province), deriveProvince(r))
venue := firstNonEmpty(strings.ToUpper(req.Venue), deriveVenue(r))
issue := firstNonEmpty(strings.TrimSpace(req.Issue), deriveIssue(r))


score := computeScore(r) // replace with real scoring


journey := services.BuildFallbackJourney(province, venue, normalizeIssue(issue))


respondJSON(w, MeritResponse{Score: score, Journey: journey})
}


// --- helpers (stubs you can wire into your real logic) ---
func computeScore(r *http.Request) float64 { return 0.72 }
func deriveProvince(r *http.Request) string { return "ON" }
func deriveVenue(r *http.Request) string { return "LTB" }
func deriveIssue(r *http.Request) string { return "tenant_repairs" }


func normalizeIssue(s string) string {
s = strings.ToLower(strings.TrimSpace(s))
switch s {
case "t2", "tenant_rights":
return "tenant_repairs" // map your synonyms as needed
case "t6", "maintenance":
return "tenant_repairs"
default:
return s
}
}


func firstNonEmpty(a, b string) string {
if strings.TrimSpace(a) != "" {
return a
}
return b
}


func respondJSON(w http.ResponseWriter, v interface{}) {
w.Header().Set("Content-Type", "application/json")
_ = json.NewEncoder(w).Encode(v)
