# syntax=docker/dockerfile:1

# --- build stage ---
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod ./
# COPY go.sum .   # uncomment if you add one later
RUN go mod download
COPY . .
# build a static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /out/server .

# --- run stage (has CA certs) ---
FROM gcr.io/distroless/base-debian12
ENV PORT=8080
USER nonroot:nonroot
COPY --from=build /out/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
