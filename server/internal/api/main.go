package api

import (
	"context"
	"encoding/gob"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/model"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/database"
	"github.com/google/go-github/github"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

func init() {
	gob.Register(&oauth2.Token{})
}

type Server struct {
	*http.Server

	log         *zap.SugaredLogger
	db          *database.DB
	oauthConfig *oauth2.Config
	oauthState  map[uuid.UUID]string

	sessionStore sessions.Store
}

func NewServer(
	log *zap.SugaredLogger,
	db *database.DB,
	oauthConfig *oauth2.Config,
	sessionSecret []byte,
) *Server {
	srv := &Server{
		Server: &http.Server{
			Addr: ":8080",
		},
		log:          log,
		db:           db,
		oauthConfig:  oauthConfig,
		oauthState:   make(map[uuid.UUID]string),
		sessionStore: sessions.NewCookieStore(sessionSecret),
	}

	http.HandleFunc("/auth/github", srv.handleGithubAuth)
	http.HandleFunc("/auth/github/callback", srv.handleGithubAuthCallback)

	http.HandleFunc("/issues", srv.handleGetOpenIssues)

	return srv
}

func (s *Server) handleGithubAuth(w http.ResponseWriter, r *http.Request) {
	var err error
	defer func() {
		if err != nil {
			s.log.Error(err)
			http.Error(w, "error authenticating", http.StatusInternalServerError)
		}
	}()

	query := r.URL.Query()
	redirect := query.Get("redirect")
	if redirect == "" {
		// default to redirecting to the home page
		redirect = "/"
	}
	redirectURL, err := url.Parse(redirect)
	if err != nil {
		err = fmt.Errorf("redirect should be a valid url: %s", redirect)
		return
	}
	if redirectURL.Scheme != "" || redirectURL.Host != "" {
		err = fmt.Errorf("redirect should be local url: %s", redirect)
		return
	}

	state := uuid.New()
	s.oauthState[state] = redirect

	authURL := s.oauthConfig.AuthCodeURL(state.String())
	http.Redirect(w, r, authURL, http.StatusFound)
}

func (s *Server) handleGithubAuthCallback(w http.ResponseWriter, r *http.Request) {
	var err error
	defer func() {
		if err != nil {
			s.log.Error(err)
			http.Error(w, "error authenticating", http.StatusInternalServerError)
		}
	}()
	ctx := r.Context()

	query := r.URL.Query()
	s.log.Debugf("oauth query string: %s", query.Encode())

	code := query.Get("code")
	stateString := query.Get("state")
	if code == "" || stateString == "" {
		err = fmt.Errorf("code or state invalid: code=%s, state=%s", code, stateString)
		return
	}

	state, err := uuid.Parse(stateString)
	if err != nil {
		err = fmt.Errorf("error parsing state uuid: %s", err)
		return
	}
	redirect, ok := s.oauthState[state]
	if !ok {
		err = fmt.Errorf("state not found: %s", state.String())
		return
	}

	token, err := s.oauthConfig.Exchange(ctx, code)
	if err != nil {
		err = fmt.Errorf("error exchanging oauth token: %s", err)
		return
	}
	oauthClient := s.oauthConfig.Client(ctx, token)

	client := github.NewClient(oauthClient)
	// empty user string gets the current user
	// https://github.com/google/go-github/issues/473
	user, _, err := client.Users.Get(ctx, "")
	if err != nil {
		err = fmt.Errorf("error getting github user: %s", err)
		return
	}
	userID := user.GetID()
	if userID == 0 {
		err = fmt.Errorf("userid cannot be 0: %v", user)
		return
	}

	session, err := s.sessionStore.Get(r, "sh_session")
	if err != nil {
		return
	}
	session.Values["id"] = userID
	session.Values["token"] = token
	err = session.Save(r, w)
	if err != nil {
		return
	}

	http.Redirect(w, r, redirect, http.StatusFound)
}

func (s *Server) handleGetOpenIssues(w http.ResponseWriter, r *http.Request) {
	var err error
	defer func() {
		if err != nil {
			s.log.Error(err)
			http.Error(w, "error getting issues", http.StatusInternalServerError)
		}
	}()
	ctx := r.Context()

	session, err := s.sessionStore.Get(r, "sh_session")
	if err != nil {
		return
	}
	client, err := s.getClientFromSession(session)
	if err != nil {
		return
	}

	opts := &github.IssueListOptions{
		Filter:    "subscribed",
		State:     "open",
		Sort:      "updated",
		Direction: "desc",
	}

	var issues []*model.Issue
	for {
		issuePage, resp, err := client.Issues.List(ctx, true, opts)
		if err != nil {
			return
		}
		for _, issue := range issuePage {
			if issue.IsPullRequest() {
				// only looking for issues, skip PRs
				continue
			}
			issues = append(issues, &model.Issue{
				ID:             int(*issue.ID),
				Title:          *issue.Title,
				URL:            *issue.URL,
				IsOpen:         *issue.State == "open",
				ExistsBounty:   false,
				BountyRewarded: false,
			})
		}
		if resp.NextPage == 0 {
			break
		}
		opts.Page = resp.NextPage
	}

	payload, err := json.Marshal(issues)
	if err != nil {
		return
	}

	_, err = w.Write(payload)
}

func (s *Server) getClientFromSession(session *sessions.Session) (*github.Client, error) {
	if token, ok := session.Values["token"].(*oauth2.Token); ok {
		client := s.oauthConfig.Client(context.Background(), token)
		return github.NewClient(client), nil
	}
	return nil, errors.New("no token found in session")
}
