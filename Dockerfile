# ===============================
# 1) Build the frontend (Vite)
# ===============================
FROM node:20-alpine AS web
WORKDIR /web

# Install deps (cache-friendly)
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source and build
COPY frontend/ ./frontend
RUN cd frontend && npm run build
# Output: /web/frontend/dist

# ===============================
# 2) Build the Go backend
# ===============================
FROM golang:1.22-alpine AS go-build
WORKDIR /src
RUN apk add --no-cache ca-certificates

# Modules first for cache
COPY go.mod ./
# If you have go.sum, uncomment the next line:
# COPY go.sum ./
RUN go mod download

# Copy backend source
COPY . .

# Bring built frontend into the backend tree
COPY --from=web /web/frontend/dist ./frontend/dist

# Build the server
ENV CGO_ENABLED=1
RUN go build -o /out/server ./main.go

# ===============================
# 3) Final runtime image
# ===============================
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates wget

# Copy built server + static assets
COPY --from=go-build /out/server /app/server
COPY --from=go-build /src/frontend/dist /app/frontend/dist
# If you serve gated PDFs, keep this (else remove):
# COPY docs /docs

# Server config
ENV STATIC_DIR=/app/frontend/dist
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["/app/server"]
