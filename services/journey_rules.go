package services

import (
	"encoding/json"
	"errors"
	"os"

	moduleTypes "github.com/Justice-Bot-Canada/plain-justice-go/types"
)

// BuildFallbackJourney always returns a usable journey for the given province/venue/issue.
func BuildFallbackJourney(province, venue, issue string) moduleTypes.LegalJourney {
	j := moduleTypes.LegalJourney{
		Province:   province,
		Venue:      venue,
		IssueCode:  issue,
		Confidence: 0.6,
	}

	// Try to load from JSON first
	if loaded, err := buildFromProceduresJSON(province, venue, issue); err == nil {
		return loaded
	}

	// === Ontario LTB tenant repairs (T6) ===
	if province == "ON" && venue == "LTB" && (issue == "tenant_repairs" || issue == "t6") {
		j.Steps = []moduleTypes.JourneyStep{
			{
				Title:   "Document the repair issue",
				Summary: "Collect evidence of the maintenance problem.",
				Actions: []string{
					"Take photos or videos of the issue.",
					"Keep written records of when you reported the problem.",
					"Save any correspondence with your landlord.",
				},
				Who:         "Applicant",
				Venue:       "LTB",
				DeadlineTip: "File your T6 application within one year of the issue.",
			},
			{
				Title:   "File a T6 application",
				Summary: "Submit your application to the Landlord and Tenant Board.",
				Actions: []string{
					"Complete the T6 form online or on paper.",
					"Pay the filing fee or request a fee waiver.",
					"Serve a copy on your landlord.",
				},
				Forms: []moduleTypes.FormRef{
					{Id: "ON-LTB-T6", Name: "T6 — Tenant Application about Maintenance", Url: "https://tribunalsontario.ca/ltb/forms/"},
				},
				Who:         "Applicant",
				Venue:       "LTB",
				DeadlineTip: "File promptly to preserve your rights.",
			},
			{
				Title:   "Attend the hearing",
				Summary: "Present your case to an adjudicator.",
				Actions: []string{
					"Bring all your evidence and documents.",
					"Be prepared to explain the issue and what you want.",
				},
				Who:         "Applicant",
				Venue:       "LTB",
				DeadlineTip: "Arrive on time; late arrivals may have their case dismissed.",
			},
		}
		return j
	}

	// === Ontario HRTO ===
	if province == "ON" && venue == "HRTO" {
		j.Steps = []moduleTypes.JourneyStep{
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
				Forms: []moduleTypes.FormRef{
					{Id: "ON-HRTO-F1", Name: "HRTO — Form 1 (Application)", Url: "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"},
				},
				Who:         "Applicant",
				Venue:       "HRTO",
				DeadlineTip: "File before the deadline; extensions are discretionary.",
			},
		}
		return j
	}

	// === Generic fallback ===
	j.Steps = []moduleTypes.JourneyStep{
		{
			Title:   "Clarify the legal issue and venue",
			Summary: "We couldn't match a province/venue rule. Lock this down to proceed.",
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
func buildFromProceduresJSON(province, venue, issue string) (moduleTypes.LegalJourney, error) {
	var j moduleTypes.LegalJourney

	if province != "ON" { // only ON dataset provided for now
		return j, errors.New("unsupported province dataset")
	}

	b, err := os.ReadFile("data/procedures.on.json")
	if err != nil {
		return j, err
	}

	var db map[string]map[string]map[string]moduleTypes.LegalJourney // province->venue->issue->journey
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
