# Files to create/add

Below are ready-to-drop files for a **deterministic journey fallback** so your “blank card” turns into actionable steps + form links every time. Paths are suggestions—adjust imports to your project layout.

---

## `/types/journey.go`

```go
package types

// Stable schema for journeys returned by the merit endpoint

type JourneyStep struct {
    Title       string    `json:"title"`
    Summary     string    `json:"summary"`
    Actions     []string  `json:"actions"`
    Forms       []FormRef `json:"forms"`
    Prereqs     []string  `json:"prereqs"`
    Who         string    `json:"who"`
    Venue       string    `json:"venue"`
    DeadlineTip string    `json:"deadlineTip"`
}

type FormRef struct {
    Id   string `json:"id"`
    Name string `json:"name"`
    Url  string `json:"url"`
    Fee  string `json:"fee,omitempty"`
}

type LegalJourney struct {
    Province   string        `json:"province"`
    Venue      string        `json:"venue"`
    IssueCode  string        `json:"issueCode"`
    Confidence float64       `json:"confidence"`
    Steps      []JourneyStep `json:"steps"`
}
```

---

## `/services/journey_rules.go`

```go
package services

import (
    "encoding/json"
    "errors"
    "os"

    "yourmodule/types" // TODO: replace with your real module path
)

// BuildFallbackJourney returns a deterministic journey (no AI needed) based on province/venue/issue.
func BuildFallbackJourney(province, venue, issue string) types.LegalJourney {
    // Try data-driven first (procedures JSON). If that fails, use hardcoded rules below.
    if j, err := buildFromProceduresJSON(province, venue, issue); err == nil && len(j.Steps) > 0 {
        return j
    }

    j := types.LegalJourney{
        Province:   province,
        Venue:      venue,
        IssueCode:  issue,
        Confidence: 0.65,
    }

    // Ontario — LTB: tenant repairs / harassment → T2/T6 lane
    if province == "ON" && venue == "LTB" && (issue == "tenant_repairs" || issue == "harassment") {
        j.Steps = []types.JourneyStep{
            {
                Title:   "Document issues and notify the landlord",
                Summary: "Collect proof and give written notice with a reasonable time to fix.",
                Actions: []string{
                    "Collect photos/videos, maintenance requests, and responses.",
                    "Send/keep a dated written notice to the landlord.",
                },
                Who:         "Tenant",
                Venue:       "LTB",
                DeadlineTip: "ASAP — you’ll need proof you asked for repairs before filing.",
            },
            {
                Title:   "File the LTB application",
                Summary: "Start an application for tenant rights/maintenance (commonly T2/T6).",
                Actions: []string{
                    "Complete LTB forms (T2: Tenant Rights; T6: Maintenance).",
                    "Attach evidence and your detailed timeline.",
                },
                Forms: []types.FormRef{
                    {Id: "ON-LTB-T2", Name: "LTB T2 — Application about Tenant Rights", Url: "https://tribunalsontario.ca/ltb/forms/"},
                    {Id: "ON-LTB-T6", Name: "LTB T6 — Tenant Application about Maintenance", Url: "https://tribunalsontario.ca/ltb/forms/"},
                },
                Who:         "Tenant",
                Venue:       "LTB",
                DeadlineTip: "Some remedies are time-sensitive — file promptly.",
            },
            {
                Title:   "Serve and prepare for the hearing",
                Summary: "Proper service and a clean evidence package matter.",
                Actions: []string{
                    "Serve as required; keep proof of service.",
                    "Organize exhibits, paginate, and prepare a short fact summary.",
                },
                Who:         "Tenant",
                Venue:       "LTB",
                DeadlineTip: "Follow service rules exactly.",
            },
        }
        return j
    }

    // Ontario — HRTO discrimination → Form 1 lane
    if province == "ON" && venue == "HRTO" && issue == "discrimination" {
        j.Steps = []types.JourneyStep{
            {
                Title:   "Write down what happened and when",
                Summary: "Map events, protected grounds, and adverse impacts.",
                Actions: []string{
                    "List dates, people involved, and witnesses.",
                    "Identify protected grounds (e.g., disability, family status).",
                },
                Who:         "Applicant",
                Venue:       "HRTO",
                DeadlineTip: "HRTO has limitation periods — do not wait.",
            },
            {
                Title:   "Start your HRTO application",
                Summary: "File Form 1 and Schedule A with facts and remedies sought.",
                Actions: []string{
                    "Complete the core application and attach Schedule A.",
                    "Describe remedies (monetary and non-monetary).",
                },
                Forms: []types.FormRef{
                    {Id: "ON-HRTO-F1", Name: "HRTO — Form 1 (Application)", Url: "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"},
                },
                Who:         "Applicant",
                Venue:       "HRTO",
                DeadlineTip: "File before the deadline; extensions are discretionary.",
            },
        }
        return j
    }

    // Generic fallback
    j.Steps = []types.JourneyStep{
        {
            Title:   "Clarify the legal issue and venue",
            Summary: "We couldn’t match a province/venue rule. Lock this down to proceed.",
            Actions: []string{
                "Confirm your province and tribunal/court.",
                "List the outcome you want (repairs, compensation, order to stop, etc.).",
            },
            Who:         "Applicant",
            Venue:       "Unknown",
            DeadlineTip: "Some remedies are time-limited.",
        },
    }
    return j
}

// buildFromProceduresJSON loads data/procedures.on.json (if present) and returns a journey for the key.
func buildFromProceduresJSON(province, venue, issue string) (types.LegalJourney, error) {
    var j types.LegalJourney

    if province != "ON" { // only ON dataset provided for now
        return j, errors.New("unsupported province dataset")
    }

    b, err := os.ReadFile("data/procedures.on.json")
    if err != nil {
        return j, err
    }

    var db map[string]map[string]map[string]types.LegalJourney // province->venue->issue->journey
    if err := json.Unmarshal(b, &db); err != nil {
        return j, err
    }

    if v, ok := db[province]; ok {
        if m, ok := v[venue]; ok {
            if got, ok := m[issue]; ok {
                return got, nil
            }
        }
    }
    return j, errors.New("no match in procedures JSON")
}
```

---

## `/handlers/merit.go`

```go
package handlers

import (
    "net/http"

    "yourmodule/services" // TODO: replace with your real module path
    "yourmodule/types"
)

type MeritResponse struct {
    Score   float64           `json:"score"`
    Journey types.LegalJourney `json:"journey"`
}

// TODO: wire this to your router where the merit is returned.
func GetMerit(w http.ResponseWriter, r *http.Request) {
    // 1) Compute/lookup score as you do today (stubbed):
    score := computeScore(r) // replace with your real scoring

    // 2) Derive province/venue/issue (never leave blank). Replace with your session/case logic.
    province := deriveProvince(r) // e.g., from postal code/user profile
    venue := deriveVenue(r)       // e.g., "LTB", "HRTO", "SmallClaims", "Family"
    issue := deriveIssue(r)       // normalized code like "tenant_repairs", "harassment", "discrimination"

    // 3) Optional: try AI builder; if it errors/empty, fallback rules kick in.
    journey := services.BuildFallbackJourney(province, venue, issue)

    respondJSON(w, MeritResponse{Score: score, Journey: journey})
}

// --- helpers (stubs) ---
func computeScore(r *http.Request) float64 { return 0.72 }
func deriveProvince(r *http.Request) string { return "ON" }
func deriveVenue(r *http.Request) string    { return "LTB" }
func deriveIssue(r *http.Request) string    { return "tenant_repairs" }

func respondJSON(w http.ResponseWriter, v interface{}) {
    w.Header().Set("Content-Type", "application/json")
    // ignore error for brevity
    _ = json.NewEncoder(w).Encode(v)
}
```

> **Note:** Add `import "encoding/json"` to the imports if not already present.

---

## `/data/forms.on.json`

```json
{
  "ON-LTB-T2": {
    "id": "ON-LTB-T2",
    "name": "LTB T2 — Application about Tenant Rights",
    "url": "https://tribunalsontario.ca/ltb/forms/"
  },
  "ON-LTB-T6": {
    "id": "ON-LTB-T6",
    "name": "LTB T6 — Tenant Application about Maintenance",
    "url": "https://tribunalsontario.ca/ltb/forms/"
  },
  "ON-HRTO-F1": {
    "id": "ON-HRTO-F1",
    "name": "HRTO — Form 1 (Application)",
    "url": "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"
  }
}
```

---

## `/data/procedures.on.json`

Data-driven procedures (so you can expand without re-compiling). Structure: `province -> venue -> issueCode -> LegalJourney`.

```json
{
  "ON": {
    "LTB": {
      "tenant_repairs": {
        "province": "ON",
        "venue": "LTB",
        "issueCode": "tenant_repairs",
        "confidence": 0.7,
        "steps": [
          {
            "title": "Document issues and notify the landlord",
            "summary": "Collect proof and give written notice with a reasonable time to fix.",
            "actions": [
              "Collect photos/videos, maintenance requests, and responses.",
              "Send/keep a dated written notice to the landlord."
            ],
            "forms": [],
            "prereqs": [],
            "who": "Tenant",
            "venue": "LTB",
            "deadlineTip": "ASAP — you’ll need proof you asked for repairs before filing."
          },
          {
            "title": "File the LTB application",
            "summary": "Start an application for tenant rights/maintenance (commonly T2/T6).",
            "actions": [
              "Complete LTB forms (T2: Tenant Rights; T6: Maintenance).",
              "Attach evidence and your detailed timeline."
            ],
            "forms": [
              {"id": "ON-LTB-T2", "name": "LTB T2 — Application about Tenant Rights", "url": "https://tribunalsontario.ca/ltb/forms/"},
              {"id": "ON-LTB-T6", "name": "LTB T6 — Tenant Application about Maintenance", "url": "https://tribunalsontario.ca/ltb/forms/"}
            ],
            "prereqs": [],
            "who": "Tenant",
            "venue": "LTB",
            "deadlineTip": "Some remedies are time-sensitive — file promptly."
          },
          {
            "title": "Serve and prepare for the hearing",
            "summary": "Proper service and a clean evidence package matter.",
            "actions": [
              "Serve as required; keep proof of service.",
              "Organize exhibits, paginate, and prepare a short fact summary."
            ],
            "forms": [],
            "prereqs": [],
            "who": "Tenant",
            "venue": "LTB",
            "deadlineTip": "Follow service rules exactly."
          }
        ]
      }
    },
    "HRTO": {
      "discrimination": {
        "province": "ON",
        "venue": "HRTO",
        "issueCode": "discrimination",
        "confidence": 0.7,
        "steps": [
          {
            "title": "Write down what happened and when",
            "summary": "Map events, protected grounds, and adverse impacts.",
            "actions": [
              "List dates, people involved, and witnesses.",
              "Identify protected grounds (e.g., disability, family status)."
            ],
            "forms": [],
            "prereqs": [],
            "who": "Applicant",
            "venue": "HRTO",
            "deadlineTip": "HRTO has limitation periods — do not wait."
          },
          {
            "title": "Start your HRTO application",
            "summary": "File Form 1 and Schedule A with facts and remedies sought.",
            "actions": [
              "Complete the core application and attach Schedule A.",
              "Describe remedies (monetary and non-monetary)."
            ],
            "forms": [
              {"id": "ON-HRTO-F1", "name": "HRTO — Form 1 (Application)", "url": "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"}
            ],
            "prereqs": [],
            "who": "Applicant",
            "venue": "HRTO",
            "deadlineTip": "File before the deadline; extensions are discretionary."
          }
        ]
      }
    }
  }
}
```

---

## (Optional) `/web/components/JourneyCard.tsx` — render without blanks

```tsx
import React from "react";

type FormRef = { id: string; name: string; url: string; fee?: string };
type Step = {
  title: string;
  summary: string;
  actions: string[];
  forms: FormRef[];
  prereqs?: string[];
  who?: string;
  venue?: string;
  deadlineTip?: string;
};

type Journey = {
  province: string;
  venue: string;
  issueCode: string;
  confidence: number;
  steps: Step[];
};

export default function JourneyCard({ journey }: { journey?: Journey }) {
  if (!journey) {
    return (
      <div className="rounded-xl border p-4 bg-white">
        <p>No journey yet. Generate a plan.</p>
      </div>
    );
  }

  const steps = journey.steps || [];
  const empty = steps.length === 0;

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="mb-2 text-sm text-gray-600">
        {journey.province} · {journey.venue} · {journey.issueCode} · conf {Math.round(journey.confidence*100)}%
      </div>
      {empty ? (
        <div className="text-amber-700">We couldn’t build steps. Click “Generate fallback plan”.</div>
      ) : (
        <ol className="space-y-4 list-decimal list-inside">
          {steps.map((s, i) => (
            <li key={i} className="bg-gray-50 rounded-lg p-3">
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-700">{s.summary}</div>
              {s.actions?.length > 0 && (
                <ul className="mt-2 text-sm ml-4 list-disc">
                  {s.actions.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              )}
              {s.forms?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.forms.map((f) => (
                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border px-2 py-1 text-sm">
                      {f.name}
                    </a>
                  ))}
                </div>
              )}
              {s.deadlineTip && (
                <div className="mt-2 text-xs text-gray-600">⏰ {s.deadlineTip}</div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

---

## Wiring checklist

* Add the `types` and `services` packages to your module, fix import paths.
* Ensure `GetMerit` endpoint **always** includes a non-empty `journey` in the JSON response (fallback rules guarantee this).
* Place JSON files under `data/` and commit them. The service loads `procedures.on.json` automatically.
* Render `JourneyCard` with the API’s `journey` payload; show a warning state only if empty (shouldn’t happen with fallback).

## Next additions (ask me when ready)

* Add **Small Claims (ON)** and **Family/CAS** issues to `procedures.on.json`.
* Postal code → province normalizer and venue resolver.
* Unit tests for rules and endpoint contract.
