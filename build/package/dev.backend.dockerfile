FROM golang:latest

# Set the working directory in the container
WORKDIR /app

# Copy the Go module files
COPY go.mod go.sum ./
RUN go mod tidy

# Copy the rest of the application source code into the container
COPY . .

# Build and run the Go application
ENTRYPOINT ["go", "run", "./cmd/tokenbase/tokenbase.go"]