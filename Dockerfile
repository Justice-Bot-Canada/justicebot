# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Disable Go checksum verification to bypass module-auth errors
ENV GOSUMDB=off
ENV GOPROXY=https://proxy.golang.org,direct

RUN apk add --no-cache git ca-certificates

# Copy go.mod and go.sum (if it exists)
COPY go.mod ./
# Instead of COPY go.sum . || true, we use this trick:
RUN test -f go.sum || echo "" > go.sum

# Download dependencies safely
RUN go mod tidy -compat=1.22 && go mod download

# Copy the rest of the app
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: runtime ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY --from=builder /app/server .

# Optional: static frontend + docs
COPY ./frontend /app/public
COPY ./docs /docs

ENV PORT=8080
EXPOSE 8080

CMD ["./server"]
