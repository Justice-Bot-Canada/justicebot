# ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy frontend files (use src instead of frontend)
COPY src/package*.json ./
RUN npm install

# Copy everything else and build
COPY src/ .
RUN npm run build

# ---- Stage 2: Build Go backend ----
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app

# Copy Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source
COPY . .

# Copy built frontend from previous stage
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Build Go app
RUN go build -o main .

# ---- Stage 3: Final image ----
FROM alpine:3.19
WORKDIR /app

# Copy compiled binary and static files
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/docs ./docs

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV PAYPAL_ENV=sandbox

# Run the server
CMD ["./main"]
