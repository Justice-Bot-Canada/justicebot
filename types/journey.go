package types
// Stable schema for journeys returned by the merit endpoint.
type JourneyStep struct {
Title string `json:"title"`
Summary string `json:"summary"`
Actions []string `json:"actions"`
Forms []FormRef `json:"forms"`
Prereqs []string `json:"prereqs"`
Who string `json:"who"`
Venue string `json:"venue"`
DeadlineTip string `json:"deadlineTip"`
}
type FormRef struct {
Id string `json:"id"`
Name string `json:"name"`
Url string `json:"url"`
Fee string `json:"fee,omitempty"`
}
type LegalJourney struct {
Province string `json:"province"`
Venue string `json:"venue"`
IssueCode string `json:"issueCode"`
Confidence float64 `json:"confidence"`
Steps []JourneyStep `json:"steps"`
}Code"`
Confidence float64 `json:"confidence"`
