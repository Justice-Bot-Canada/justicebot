# ============== Stage 1: build Go ==============
FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Copy only go.mod first (you don't have go.sum yet)
COPY go.mod ./
RUN go mod download

# Now copy the rest of the backend
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

# ============== Stage 2: runtime image ==============
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Copy the compiled binary
COPY --from=builder /app/server .

# Copy your static site and docs exactly as they exist in the repo root
COPY frontend ./frontend
COPY docs ./docs

# App config
ENV PORT=8080
EXPOSE 8080

CMD ["./server"]
