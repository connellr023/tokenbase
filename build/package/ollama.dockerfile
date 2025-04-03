FROM ollama/ollama:latest

# Copy the list of models
COPY ../../configs/models.txt ./models.txt

# Copy script
COPY ../../scripts/ollamastart.sh ./ollamastart.sh

# Make it executable
RUN chmod +x /ollamastart.sh

ENTRYPOINT ["/bin/bash", "/ollamastart.sh"]