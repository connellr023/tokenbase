FROM golang:latest

EXPOSE 8090

# Set the working directory in the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./
RUN go mod tidy

# Copy the rest of the application source code into the container
COPY . .

# Copy the .env file into the container
COPY .env .env

# Build and run the Go application
ENTRYPOINT ["go", "run", "./cmd/tokenbase/tokenbase.go"]