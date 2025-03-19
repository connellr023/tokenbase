#!/bin/bash

# List of models to pull and run
models=("tinyllama:1.1b" "qwen2.5:0.5b")

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama server to be active..."
while [ "$(ollama list | grep 'NAME')" == "" ]; do
  sleep 1
done

for model in "${models[@]}"; do
  echo "Pulling model: $model"
  ollama pull "$model"
done

wait