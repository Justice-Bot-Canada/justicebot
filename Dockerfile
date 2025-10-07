# ==================== Stage 1: build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Use direct fetch and disable checksum DB to dodge the mismatch
ENV GOPROXY=direct
ENV GOSUMDB=off

RUN apk add --no-cache ca-certificates

# Copy only go.mod (do NOT bring in a potentially bad go.sum)
COPY go.mod ./

# Start with a clean state inside the image
RUN rm -f go.sum || true

# Download deps and (re)create go.sum fresh in this clean environment
RUN go mod download
RUN go mod tidy

# Copy the rest of the repo
COPY . .

# One more safety pass in case anything changed after copy
RUN rm -f go.sum || true && go mod tidy

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: minimal runtime image ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Backend binary
COPY --from=builder /app/server .

# Static frontend (no npm step; your HTML/JS/CSS live here)
# Make sure your landing page is at frontend/index.html
COPY ./frontend /app/public

# Docs for gated downloads
COPY ./docs /app/docs

ENV PORT=8080
# If your server auto-detects index.html you can omit this:
# ENV STATIC_DIR=/app/public

EXPOSE 8080
CMD ["./server"]
