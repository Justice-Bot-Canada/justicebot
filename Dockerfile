# ---- Stage 1: Build frontend (supports two layouts) -------------------------
FROM node:20-alpine AS web
WORKDIR /web

# Case A: frontend/ (package.json inside ./frontend)
COPY frontend/package*.json ./frontend/ 2>/dev/null || true
RUN if [ -f ./frontend/package.json ]; then cd frontend && npm ci; fi

# Case B: root-level Vite (package.json at repo root)
COPY package*.json ./ 2>/dev/null || true
RUN if [ -f ./package.json ]; then npm ci; fi

# Copy sources (both cases) and build if scripts exist
COPY frontend ./frontend 2>/dev/null || true
COPY . .  # (harmless; we only use package.json presence checks)
RUN if [ -f ./frontend/package.json ]; then cd frontend && npm run build; \
    elif [ -f ./package.json ]; then npm run build; \
    else echo "No frontend to build"; fi

# After build, one of these will exist:
#  - /web/frontend/dist           (Case A)
#  - /web/dist                    (Case B)

# ---- Stage 2: Build Go backend ---------------------------------------------
FROM golang:1.22-alpine AS go-build
WORKDIR /src
RUN apk add --no-cache ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Copy built frontend from whichever path exists
RUN mkdir -p /src/frontend/dist
COPY --from=web /web/frontend/dist /src/frontend/dist 2>/dev/null || true
COPY --from=web /web/dist          /src/frontend/dist 2>/dev/null || true

# Build binary
ENV CGO_ENABLED=1
RUN go build -o /out/server ./main.go

# ---- Stage 3: Final image ---------------------------------------------------
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates wget

# App binary
COPY --from=go-build /out/server /app/server

# Static site (if present)
COPY --from=go-build /src/frontend/dist /app/frontend/dist 2>/dev/null || true
# Optional gated PDFs:
# COPY docs /docs

ENV PORT=8080
ENV STATIC_DIR=/app/frontend/dist
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["/app/server"]
