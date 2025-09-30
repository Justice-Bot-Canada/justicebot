package services
import (
"encoding/json"
"errors"
"os"
"strings"
moduleTypes "github.com/Justice-Bot-Canada/plain-justice-go/types"
)
// BuildFallbackJourney returns a deterministic journey (no AI required)
// based on province, venue, and normalized issue code.
func BuildFallbackJourney(province, venue, issue string)
moduleTypes.LegalJourney {
province = strings.ToUpper(strings.TrimSpace(province))
venue = strings.ToUpper(strings.TrimSpace(venue))
issue = strings.TrimSpace(issue)
// Try data-driven (procedures JSON). If present and matches, use it.
if j, err := buildFromProceduresJSON(province, venue, issue); err == nil &&
len(j.Steps) > 0 {
return j
}
j := moduleTypes.LegalJourney{
Province: province,
Venue: venue,
IssueCode: issue,
Confidence: 0.65,
}
// === Ontario — LTB: tenant repairs / harassment (T2/T6) ===
if province == "ON" && venue == "LTB" && (issue == "tenant_repairs" ||
issue == "harassment") {
j.Steps = []moduleTypes.JourneyStep{
{
Title: "Document issues and notify the landlord",
Summary: "Collect proof and give written notice with a
reasonable time to fix.",
Actions: []string{
"Collect photos/videos, maintenance requests, and
responses.",
"Send/keep a dated written notice to the landlord.",
  },
Who: "Tenant",
Venue: "LTB",
DeadlineTip: "ASAP — you’ll need proof you asked for repairs
before filing.",
},
{
Title: "File the LTB application",
Summary: "Start an application for tenant rights/maintenance
(commonly T2/T6).",
Actions: []string{
"Complete LTB forms (T2: Tenant Rights; T6: Maintenance).",
"Attach evidence and your detailed timeline.",
},
Forms: []moduleTypes.FormRef{
{Id: "ON-LTB-T2", Name: "LTB T2 — Application about Tenant
Rights", Url: "https://tribunalsontario.ca/ltb/forms/"},
{Id: "ON-LTB-T6", Name: "LTB T6 — Tenant Application about
Maintenance", Url: "https://tribunalsontario.ca/ltb/forms/"},
},
Who: "Tenant",
Venue: "LTB",
DeadlineTip: "Some remedies are time-sensitive — file
promptly.",
},
{
Title: "Serve and prepare for the hearing",
Summary: "Proper service and a clean evidence package matter.",
Actions: []string{
"Serve as required; keep proof of service.",
"Organize exhibits, paginate, and prepare a short fact
summary.",
},
Who: "Tenant",
Venue: "LTB",
DeadlineTip: "Follow service rules exactly.",
},
}
return j
}
// === Ontario — HRTO discrimination (Form 1) ===
if province == "ON" && venue == "HRTO" && issue == "discrimination" {
j.Steps = []moduleTypes.JourneyStep{
{
Title: "Write down what happened and when",
Summary: "Map events, protected grounds, and adverse impacts.",
Actions: []string{
"List dates, people involved, and witnesses.",
"Identify protected grounds (e.g., disability, family
status).",
},
Who: "Applicant",
Venue: "HRTO",
DeadlineTip: "HRTO has limitation periods — do not wait.",
},
{
Title: "Start your HRTO application",
Summary: "File Form 1 and Schedule A with facts and remedies
sought.",
Actions: []string{
"Complete the core application and attach Schedule A.",
"Describe remedies (monetary and non-monetary).",
},
Forms: []moduleTypes.FormRef{
{Id: "ON-HRTO-F1", Name: "HRTO — Form 1 (Application)",
Url: "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"},
},
Who: "Applicant",
Venue: "HRTO",
DeadlineTip: "File before the deadline; extensions are discretionary.",
},
}
return j
}
// === Generic fallback ===
j.Steps = []moduleTypes.JourneyStep{
{
Title: "Clarify the legal issue and venue",
Summary:
"We couldn’t match a province/venue rule. Lock this down to proceed.",
Actions: []string{
"Confirm your province and tribunal/court.",
"List the outcome you want (repairs, compensation, order to
stop, etc.).",
},
Who: "Applicant",
Venue: "Unknown",
DeadlineTip: "Some remedies are time-limited.",
},
}
return j
}
// buildFromProceduresJSON loads data/procedures.on.json (if present) and
returns a journey for the key.
func buildFromProceduresJSON(province, venue, issue string)
(moduleTypes.LegalJourney, error) {
var j moduleTypes.LegalJourney
if province != "ON" { // only ON dataset provided for now
return j, errors.New("unsupported province dataset")
}
b, err := os.ReadFile("data/procedures.on.json")
if err != nil {
return j, err
}
var db map[string]map[string]map[string]moduleTypes.LegalJourney //
province->venue->issue->journey
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
return j, errors.New("no match in procedures  JSON")
}

