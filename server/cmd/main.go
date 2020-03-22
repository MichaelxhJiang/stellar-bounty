package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/api"
	"golang.org/x/oauth2/github"

	"github.com/MichaelxhJiang/stellar-bounty/server/internal/database"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"golang.org/x/oauth2"
)

func main() {
	// config
	var clientID, clientSecret string
	flag.StringVar(&clientID, "client-id", os.Getenv("GH_CLIENT_ID"), "GitHub OAuth client id")
	flag.StringVar(&clientSecret, "client-secret", os.Getenv("GH_CLIENT_SECRET"), "GitHub OAuth client secret")
	flag.Parse()

	oauthConfig := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Endpoint:     github.Endpoint,
		RedirectURL:  "http://localhost:8080/auth/github/callback",
	}

	fmt.Println("Auth URL:", oauthConfig.AuthCodeURL(""))

	// logging
	logConfig := zap.NewDevelopmentConfig()
	logConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	logger, err := logConfig.Build()
	if err != nil {
		panic(err)
	}
	log := logger.Sugar()
	defer log.Sync()

	// database
	db := database.NewDB(log)
	apiServer := api.NewServer(log, db, oauthConfig)

	apiServer.ListenAndServe()
}
