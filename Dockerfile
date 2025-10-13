# ==================== Stage 1: Build Frontend ====================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to handle version conflicts
RUN npm install --legacy-peer-deps

# Copy all necessary files for build
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build the React app
RUN npm run build

# ==================== Stage 2: Build Go Backend ====================
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app

# Fallback to direct GitHub fetch if proxy fails
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=off

RUN apk add --no-cache ca-certificates git

# Copy go.mod first (skip go.sum)
COPY go.mod ./

# Download modules (retry if needed)
RUN go mod download || \
    (sleep 2 && go mod download) || \
    (GOPROXY=direct go mod download)

# Copy the rest of the repo
COPY . .

# Ensure deps are tidy (recreates go.sum deterministically)
RUN go mod tidy

# Build the static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ==================== Stage 3: Runtime ====================
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Copy backend binary
COPY --from=backend-builder /app/server .

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/dist /app/public

# Copy docs (if they exist)
COPY ./docs /app/docs

ENV PORT=8080
ENV STATIC_DIR=/app/public
EXPOSE 8080
CMD ["./server"]
