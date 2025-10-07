# ==================== Stage 1: Build Go backend ====================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# System deps (certs for HTTPS)
RUN apk add --no-cache ca-certificates

# Go modules first (better cache). We don't require go.sum here.
COPY go.mod ./
RUN go mod download

# Copy the rest of the backend source
COPY . .

# Tidy modules (creates/updates go.sum deterministically)
RUN go mod tidy

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 2: Final runtime image ====================
FROM alpine:3.19
WORKDIR /app

# Certs for HTTPS
RUN apk add --no-cache ca-certificates

# Copy the compiled server
COPY --from=builder /app/server .

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
