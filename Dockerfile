# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Use Go proxy and disable checksum validation
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=off

RUN apk add --no-cache git ca-certificates

# Copy go.mod (and go.sum if it exists)
COPY go.mod ./
COPY go.sum . || true

# Clean and reinitialize module cache (force trust)
RUN go mod tidy -compat=1.22 || true
RUN go clean -modcache || true
RUN go mod download || true

# Copy the rest of the source
COPY . .

# Force rebuild ignoring module-auth issues
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -mod=mod -o server ./main.go

# ==================== Stage 2: runtime image ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY --from=builder /app/server .

# Static frontend
COPY ./frontend /app/public

# Docs (PDFs)
COPY ./docs /docs

ENV PORT=8080
EXPOSE 8080
CMD ["./server"]
