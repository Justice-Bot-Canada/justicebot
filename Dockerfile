# ===============================
# 1) Build the frontend (Vite)
# ===============================
FROM node:20-alpine AS web
WORKDIR /web

# Install deps (cache-friendly)
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source and build
COPY frontend ./frontend
RUN cd frontend && npm run build
# Output: /web/frontend/dist

# ===============================
# 2) Build the Go backend
# ===============================
FROM golang:1.22-alpine AS go-build
WORKDIR /src

# Certs for TLS during build if needed
RUN apk add --no-cache ca-certificates

# Modules first for cache
COPY go.mod ./
# COPY go.sum ./  # uncomment if present
RUN go mod download

# Copy the rest of the backend source
COPY . .

# Build static binary
ENV CGO_ENABLED=1
RUN go build -o /out/server ./main.go

# ===============================
# 3) Final runtime image
# ===============================
FROM alpine:3.20
WORKDIR /app

# Minimal runtime deps
RUN apk add --no-cache ca-certificates

# Copy Go server
COPY --from=go-build /out/server /app/server

# Copy built frontend
COPY --from=web /web/frontend/dist /app/frontend/dist

# (Optional) gated PDFs for /api/docs/* if you use them
# COPY docs /docs

# App config: serve SPA from this dir; Railway provides PORT
ENV STATIC_DIR=/app/frontend/dist
ENV PORT=8080

EXPOSE 8080

# (Optional) Healthcheck (Go handler at /api/health)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["/app/server"]
