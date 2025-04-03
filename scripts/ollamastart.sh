#!/bin/bash

# Path to the models file
MODELS_FILE="$(dirname "$0")/models.txt"

echo "Starting Ollama server..."
ollama serve &

# Path to the flag file
FLAG_FILE="./ollamastart.flag"

# Check if the flag file exists
if [ -f "$FLAG_FILE" ]; then
  echo "Script has already run."
  wait
fi

echo "Waiting for Ollama server to be active..."
while [ "$(ollama list | grep 'NAME')" == "" ]; do
  sleep 1
done

# Check if models file exists
if [ ! -f "$MODELS_FILE" ]; then
  echo "Error: Models file not found at $MODELS_FILE"
  exit 1
fi

# Read models from file
while IFS= read -r model || [[ -n "$model" ]]; do
  # Skip empty lines and comments
  if [[ -z "$model" ]] || [[ "$model" == \#* ]]; then
    continue
  fi
  
  echo "Pulling model: $model"
  ollama pull "$model"
done < "$MODELS_FILE"

touch "$FLAG_FILE"

wait