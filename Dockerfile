# ===============================
# 1) Build the frontend (Vite)
# ===============================
FROM node:20-alpine AS web
WORKDIR /web

# install deps (cache-friendly)
COPY src/frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# copy source and build
COPY src/frontend ./frontend
RUN cd frontend && npm run build
# output: /web/frontend/dist

# ===============================
# 2) Build the Go backend
# ===============================
FROM golang:1.22-alpine AS go-build
WORKDIR /src
RUN apk add --no-cache ca-certificates

# modules first for cache
COPY go.mod ./
# If you have go.sum, uncomment this:
# COPY go.sum ./
RUN go mod download

# copy backend source
COPY . .

# bring built frontend into the backend tree
COPY --from=web /web/frontend/dist ./frontend/dist

# build the server
ENV CGO_ENABLED=1
RUN go build -o /out/server ./main.go

# ===============================
# 3) Final runtime image
# ===============================
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates wget

# copy built server and static files
COPY --from=go-build /out/server /app/server
COPY --from=go-build /src/frontend/dist /app/frontend/dist

ENV STATIC_DIR=/app/frontend/dist
ENV PORT=8080

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["/app/server"]
