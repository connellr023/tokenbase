FROM ollama/ollama:latest

# Copy script
COPY ../../scripts/pullmodels.sh ./pullmodels.sh

# Make it executable
RUN chmod +x /pullmodels.sh

# Execute the script
RUN ./pullmodels.sh