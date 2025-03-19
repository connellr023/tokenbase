#!/bin/sh

echo "Starting SurrealDB in the background..."
/surreal start --user root --pass root &
SURREALDB_PID=$!

# Wait for SurrealDB to become available with proper health checking
echo "Waiting for SurrealDB to start..."
MAX_RETRIES=30
count=0

# Use a more reliable health check
until (/surreal isready --conn http://localhost:8000 > /dev/null 2>&1) || [ $count -eq $MAX_RETRIES ]
do
  echo "Waiting for SurrealDB to be ready... (${count}/${MAX_RETRIES})"
  sleep 2
  count=$((count + 1))
done

if [ $count -eq $MAX_RETRIES ]; then
  echo "ERROR: Timed out waiting for SurrealDB to start, but continuing anyway..."
  exit 1
fi

echo "Attempting to run migrations..."
sleep 1

# Run all .surql scripts in /docker-entrypoint-initdb.d/
if [ -d "/docker-entrypoint-initdb.d" ]; then
  for file in /docker-entrypoint-initdb.d/*.surql; do
    if [ -f "$file" ]; then
      echo "Running $file..."
      
      # Try multiple times in case SurrealDB is still initializing
      ATTEMPT=1
      MAX_ATTEMPTS=3
      SUCCESS=false
      
      while [ $ATTEMPT -le $MAX_ATTEMPTS ] && [ "$SUCCESS" = "false" ]; do
        if /surreal sql --user root --pass root --ns tokenbaseNS --db tokenbaseDB < "$file"; then
          echo "Successfully executed $file"
          SUCCESS=true
        else
          echo "Attempt $ATTEMPT failed for $file. Retrying in 2 seconds..."
          sleep 2
          ATTEMPT=$((ATTEMPT + 1))
        fi
      done
      
      if [ "$SUCCESS" = "false" ]; then
        echo "WARNING: Failed to execute $file after $MAX_ATTEMPTS attempts"
      fi
    fi
  done
else
  echo "No migration directory found at /docker-entrypoint-initdb.d/"
fi

echo "SurrealDB initialization complete. Keeping the database running..."
wait $SURREALDB_PID