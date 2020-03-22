# Stellar Bounty Server

Run the server using:
```shell
go run cmd/main.go --client-id <GitHub OAuth Client ID> --client-secret <GitHub OAuth Client Secret>
```

### GitHub OAuth Credentials for testing
[Create a new OAuth app](https://github.com/settings/applications/new) and set the
authorization callback URI as `localhost:8080/auth/github/callback`