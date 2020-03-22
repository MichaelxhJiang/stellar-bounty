package api

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/database"
	"github.com/google/go-github/github"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type Server struct {
	*http.Server

	log         *zap.SugaredLogger
	db          *database.DB
	oauthConfig *oauth2.Config
	oauthState  map[uuid.UUID]string
}

func NewServer(log *zap.SugaredLogger, db *database.DB, oauthConfig *oauth2.Config) *Server {
	srv := &Server{
		Server: &http.Server{
			Addr: ":8080",
		},
		log:         log,
		db:          db,
		oauthConfig: oauthConfig,
		oauthState:  make(map[uuid.UUID]string),
	}

	http.HandleFunc("/auth/github", srv.handleGithubAuth)
	http.HandleFunc("/auth/github/callback", srv.handleGithubAuthCallback)

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
	_, _, err = client.Users.Get(ctx, "")
	if err != nil {
		err = fmt.Errorf("error getting github user: %s", err)
		return
	}

	http.Redirect(w, r, redirect, http.StatusFound)
}
