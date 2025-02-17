FROM ollama/ollama:latest

# Copy the Ollama script
COPY ../../scripts/tinyllama.sh ./tinyllama.sh

# Make it executable
RUN chmod +x /tinyllama.sh

# Expose the Ollama API port
EXPOSE 11434

# Execute the Ollama script
RUN ./tinyllama.sh