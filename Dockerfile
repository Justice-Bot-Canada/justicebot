# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Use official Go proxy + checksum DB
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org

# Tools for HTTPS & (occasionally) fetching modules
RUN apk add --no-cache ca-certificates git

# Copy mod files first (cache-friendly)
COPY go.mod ./
# If you have go.sum, you can copy it too (optional):
# COPY go.sum ./

# Prefetch deps (tidy will create/refresh go.sum if needed)
RUN go mod tidy
# Don’t fail the build if verify only warns about sums
RUN go mod verify || true

# Copy the rest of the repo
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: minimal runtime image ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Backend binary
COPY --from=builder /app/server .

# Static frontend (no npm step). Your index.html is in /frontend.
# We serve it from /app/public to match the server's public/ option.
COPY --from=builder /app/frontend /app/public

# PDFs (uncomment if you use the gated downloads)
# COPY --from=builder /app/docs /app/docs

ENV PORT=8080
ENV STATIC_DIR=/app/public
EXPOSE 8080

CMD ["./server"]
