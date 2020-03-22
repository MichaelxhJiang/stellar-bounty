package api

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/database"
	"github.com/google/go-github/github"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type Server struct {
	*http.Server

	log         *zap.SugaredLogger
	db          *database.DB
	oauthConfig *oauth2.Config
}

func NewServer(log *zap.SugaredLogger, db *database.DB, oauthConfig *oauth2.Config) *Server {
	srv := &Server{
		Server: &http.Server{
			Addr: ":8080",
		},
		log:         log,
		db:          db,
		oauthConfig: oauthConfig,
	}

	http.HandleFunc("/auth/github/callback", srv.handleGithubAuthCallback)

	return srv
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
	s.log.Infof("oauth query string: %s", query.Encode())

	code := query.Get("code")
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

	w.Write([]byte("Your GitHub ID: " + strconv.Itoa(int(*user.ID))))
}
