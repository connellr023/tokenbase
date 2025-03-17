#!/bin/bash

# List of models to pull and run
models=("tinyllama:latest" "deepseek-r1:1.5b")

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama server to be active..."
while [ "$(ollama list | grep 'NAME')" == "" ]; do
  sleep 1
done

for model in "${models[@]}"; do
  echo "Pulling model: $model"
  ollama pull "$model"
  echo "Running model: $model"
  ollama run "$model"
done