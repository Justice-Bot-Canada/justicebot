# ========================
# Stage 1: Build frontend
# ========================
FROM node:20-alpine AS web
WORKDIR /frontend

# Install deps (cache-friendly)
COPY frontend/package*.json ./ 
RUN npm install
# Copy source and build
COPY frontend/. .
RUN npm run build

# ========================
# Stage 2: Build Go (API)
# ========================
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Tools needed by 'go' in Alpine
RUN apk add --no-cache git ca-certificates

# Make Go use the official proxy/sumdb and wipe any cached modules
RUN go env -w GOPROXY=https://proxy.golang.org,direct \
 && go env -w GOSUMDB=sum.golang.org \
 && go clean -modcache

# Copy module files first (better Docker cache)
# Copy go.sum only if it exists (prevents build errors)
RUN if [ -f go.sum ]; then cp go.sum .; fi

# Prime the module cache (will also recreate go.sum as needed)
RUN go mod tidy && go mod download

# Copy the rest of the backend
COPY . .

# Bring in the built frontend to be served by Go
COPY --from=web /frontend/dist ./frontend/dist

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ========================
# Stage 3: Runtime image
# ========================
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Copy server & static files
COPY --from=builder /app/server .
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/docs ./docs

ENV PORT=8080
EXPOSE 8080
CMD ["./server"]
