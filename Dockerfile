## ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy and install dependencies if package.json exists
COPY frontend/package*.json ./
RUN if [ -f package.json ]; then npm install; fi

# Copy the rest of the frontend
COPY frontend/ .

# Build only if build script exists
RUN if [ -f package.json ]; then npm run build || echo "no build script"; fi

# ---- Stage 2: Build Go backend ----
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app

# Copy Go modules first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source
COPY . .

# Copy built frontend if it exists
COPY --from=frontend-builder /frontend/dist ./frontend/dist || true

# Build Go binary
RUN go build -o main .

# ---- Stage 3: Final image ----
FROM alpine:3.19
WORKDIR /app

# Copy binary and assets
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/frontend/dist ./frontend/dist || true
COPY --from=backend-builder /app/docs ./docs || true

# Set environment variables
ENV PORT=8080
ENV PAYPAL_ENV=sandbox

# Expose port
EXPOSE 8080

# Run the server
CMD ["./main"]
