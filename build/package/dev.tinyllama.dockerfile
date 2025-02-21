FROM ollama/ollama:latest

# Copy the TinyLlama script
COPY ../../scripts/tinyllama.sh ./tinyllama.sh

# Make it executable
RUN chmod +x /tinyllama.sh

# Execute the script
RUN ./tinyllama.sh