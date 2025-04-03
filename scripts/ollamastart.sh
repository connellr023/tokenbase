#!/bin/bash

# List of models to pull and run
MODELS=("tinyllama:1.1b" "qwen2.5:0.5b" "llava")

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

for model in "${MODELS[@]}"; do
  echo "Pulling model: $model"
  ollama pull "$model"
done

touch "$FLAG_FILE"

wait