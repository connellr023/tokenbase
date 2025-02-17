# Use official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY ./web/package*.json ./
RUN npm install

# Copy the rest of the frontend application files
COPY ./web .

# Expose port 3000 for the Next.js dev server
EXPOSE 3000

# Run the Next.js dev server
CMD ["npm", "run", "dev"]
