package services
{
Title: "Write down what happened and when",
Summary: "Map events, protected grounds, and adverse impacts.",
Actions: []string{
"List dates, people involved, and witnesses.",
"Identify protected grounds (e.g., disability, family status).",
},
Who: "Applicant",
Venue: "HRTO",
DeadlineTip: "HRTO has limitation periods — do not wait.",
},
{
Title: "Start your HRTO application",
Summary: "File Form 1 and Schedule A with facts and remedies sought.",
Actions: []string{
"Complete the core application and attach Schedule A.",
"Describe remedies (monetary and non-monetary).",
},
Forms: []moduleTypes.FormRef{
{Id: "ON-HRTO-F1", Name: "HRTO — Form 1 (Application)", Url: "https://tribunalsontario.ca/hrto/forms-and-filing/#otherforms"},
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
Summary: "We couldn’t match a province/venue rule. Lock this down to proceed.",
Actions: []string{
"Confirm your province and tribunal/court.",
"List the outcome you want (repairs, compensation, order to stop, etc.).",
},
Who: "Applicant",
Venue: "Unknown",
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
