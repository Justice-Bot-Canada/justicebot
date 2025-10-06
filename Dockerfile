# Build the Go backend
FROM golang:1.22-alpine AS go-build
WORKDIR /src
RUN apk add --no-cache ca-certificates
COPY go.mod ./
# COPY go.sum ./   # uncomment if present
RUN go mod download
COPY . .
ENV CGO_ENABLED=1
RUN go build -o /out/server ./main.go

# Final runtime
FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=go-build /out/server /app/server

# Copy your static site (adjust includes as needed)
# If your static files live at repo root:
COPY index.html /app/frontend/dist/index.html
COPY script.js   /app/frontend/dist/script.js
# If you have a 'dev' or 'public' folder with assets, include it:
# COPY dev /app/frontend/dist/dev
# COPY public /app/frontend/dist

ENV STATIC_DIR=/app/frontend/dist
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1
CMD ["/app/server"]
