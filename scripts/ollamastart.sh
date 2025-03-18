#!/bin/bash

# List of models to pull and run
models=("qwen2.5:0.5b" "llava-phi3:3.8b")

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