# Stage 1: Build the Go application
FROM golang:latest AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code into the container
COPY . .

# Copy the .env file into the container
COPY .env .env


# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/tokenbase ./cmd/tokenbase

# Stage 2: Create a minimal image to run the Go application
FROM alpine:latest

# Install necessary CA certificates
RUN apk --no-cache add ca-certificates

# Set the working directory in the container
WORKDIR /root/

# Copy the built Go application from the build stage
COPY --from=build /app/tokenbase .

# Ensure the binary has executable permissions
RUN chmod +x ./tokenbase

# Expose port 8080
EXPOSE 8080

# Run the Go application
ENTRYPOINT ["./tokenbase"]