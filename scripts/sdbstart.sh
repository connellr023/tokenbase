#!/bin/sh

echo "Starting SurrealDB in the background..."
/surreal start --user root --pass root &

# Wait for SurrealDB to become available
echo "Waiting for SurrealDB to start..."
sleep 3

# Run all .surql scripts in /docker-entrypoint-initdb.d/
if [ -d "/docker-entrypoint-initdb.d" ]; then
  for file in /docker-entrypoint-initdb.d/*.surql; do
    if [ -f "$file" ]; then
      echo "Running $file..."
      /surreal sql --user root --pass root --ns tokenbaseNS --db tokenbaseDB < "$file"
    fi
  done
fi

echo "SurrealDB initialization complete. Keeping the database running..."
wait
