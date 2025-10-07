# ===============================
# 1) Build Go backend
# ===============================
FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Copy Go dependencies and download
COPY go.mod ./
# If you have go.sum, uncomment:
# COPY go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Build Go binary
RUN go build -o server ./main.go

# ===============================
# 2) Final runtime image
# ===============================
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates wget

# Copy the compiled Go server
COPY --from=builder /app/server .

# Copy your static frontend directly (no npm build)
COPY frontend ./frontend

# Environment setup
ENV STATIC_DIR=/app/frontend
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["./server"]
