module github.com/at-least/vpkit

go 1.26.0

ignore (
	./node_modules
)

require maragu.dev/gomponents v1.4.0

require (
	github.com/GaijinEntertainment/go-exhaustruct/v3 v3.3.1 // indirect
	golang.org/x/mod v0.41.0 // indirect
	golang.org/x/sync v0.23.0 // indirect
	golang.org/x/tools v0.51.0 // indirect
)

tool github.com/GaijinEntertainment/go-exhaustruct/v3/cmd/exhaustruct
