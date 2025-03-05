FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./web/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's files
COPY ./web .

# Build the Next.js app
RUN npm run build

# Expose the port that Next.js runs on
EXPOSE 3000

# Start the Next.js app
ENTRYPOINT ["npm", "start"]
