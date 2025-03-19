#!/bin/bash

# List of models to pull and run
models=("tinyllama:1.1b" "qwen2.5:0.5b")

echo "Starting Ollama server..."
ollama serve &
SERVER_PID=$!

echo "Waiting for Ollama server to be active..."

MAX_RETRIES=30
count=0
until ollama list > /dev/null 2>&1 || [ $count -eq $MAX_RETRIES ]
do
  echo "Waiting for Ollama server... (${count}/${MAX_RETRIES})"
  sleep 2
  count=$((count + 1))
done

if [ $count -eq $MAX_RETRIES ]; then
  echo "Timed out waiting for Ollama server to start"
  exit 1
fi

echo "Ollama server is ready. Pulling models..."

for model in "${models[@]}"; do
  echo "Pulling model: $model"
  ollama pull "$model" || echo "Failed to pull $model"
done

# Keep the script running to maintain the server
wait $SERVER_PID