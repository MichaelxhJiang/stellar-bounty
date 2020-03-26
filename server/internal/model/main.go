package model

type Issue struct {
	ID     int    `json:"id,string"`
	Title  string `json:"title"`
	URL    string `json:"githubUrl"`
	IsOpen bool   `json:"open"`

	ExistsBounty   bool `json:"bounty"`
	BountyRewarded bool `json:"rewarded"`
}
