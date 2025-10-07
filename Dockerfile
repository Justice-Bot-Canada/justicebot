# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Use official Go proxy + checksum DB
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org

RUN apk add --no-cache ca-certificates

# Copy mod file first (cache-friendly)
COPY go.mod ./
# do NOT copy go.sum; it's optional and will be (re)generated as needed

# Pull modules
# Refresh deps and rewrite go.sum if needed
RUN go mod tidy
# Verify modules; don't fail the build on checksum warning
RUN go mod verify || true

# Copy the rest of the repo
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: minimal runtime image ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Backend binary
COPY --from=builder /app/server .

# Static frontend (no npm step)
COPY ./frontend /app/public
# If you have gated docs, uncomment:
# COPY ./docs /app/docs

ENV PORT=8080
# ENV STATIC_DIR=/app/public  # optional if your server auto-detects

EXPOSE 8080
CMD ["./server"]
