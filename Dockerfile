# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Fallback to direct GitHub fetch if proxy fails
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=off

RUN apk add --no-cache ca-certificates git

# Copy go.mod first (skip go.sum)
COPY go.mod ./

# Retry-friendly mod fetch
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download || \
    (sleep 2 && go mod download) || \
    (GOPROXY=direct go mod download)

# Copy everything else
COPY . .

# Ensure modules are tidy
RUN go mod tidy

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: runtime ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/server .
COPY ./frontend /app/public
COPY ./docs /app/docs

ENV PORT=8080
EXPOSE 8080
CMD ["./server"]
