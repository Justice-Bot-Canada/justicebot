# syntax=docker/dockerfile:1

########################
# Build stage (Go)
########################
FROM golang:1.22-alpine AS build
WORKDIR /src

# Copy everything (Go code + docs) and tidy modules
COPY . .
RUN go mod tidy

# Make sure /src/docs exists even if repo has none yet
RUN mkdir -p /src/docs

# Build a static linux binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /out/server .

########################
# Run stage (tiny, with CA certs)
########################
FROM gcr.io/distroless/base-debian12
ENV PORT=8080
USER nonroot:nonroot

# App binary
COPY --from=build /out/server /server

# Gated files (safe if empty; we created the folder in build stage)
COPY --from=build /src/docs /docs

EXPOSE 8080
ENTRYPOINT ["/server"]

