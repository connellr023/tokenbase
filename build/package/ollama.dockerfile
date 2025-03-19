FROM ollama/ollama:latest

# Copy script
COPY ../../scripts/ollamastart.sh ./ollamastart.sh

# Make it executable
RUN chmod +x /ollamastart.sh

ENTRYPOINT ["/bin/bash", "/ollamastart.sh"]