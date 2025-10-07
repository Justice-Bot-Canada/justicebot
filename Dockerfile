# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Use official Go proxy + checksum DB (avoids flaky mirrors)
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org

# System certs for HTTPS
RUN apk add --no-cache ca-certificates

# Copy mod files first (better layer caching)
COPY go.mod ./
# If you have a go.sum, copy it; if not, this still works.
COPY go.sum .  || true

# Pre-fetch deps (creates/updates module cache inside the image)
RUN go mod download

# Copy the rest of the repo
COPY . .

# IMPORTANT: do NOT run `go mod tidy` here
# Build a static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: minimal runtime image ====================
FROM alpine:3.19
WORKDIR /app

RUN apk add --no-cache ca-certificates

# Copy compiled server
COPY --from=builder /app/server .

# Copy your static frontend (no npm step)
COPY ./frontend /app/public
# If you have gated docs, uncomment:
# COPY ./docs /app/docs

ENV PORT=8080
# Optional: make the UI folder explicit
# ENV STATIC_DIR=/app/public

EXPOSE 8080
CMD ["./server"]
# Copy static frontend (no npm build — just serve the files)
# We place them under /app/public so main.go will find it (pickStaticDir checks "public").
COPY ./frontend /app/public

# (Optional) gated docs if you have them
# COPY ./docs /app/docs

# App config
ENV PORT=8080
# In case you want to be explicit:
# ENV STATIC_DIR=/app/public

EXPOSE 8080
CMD ["./server"]
