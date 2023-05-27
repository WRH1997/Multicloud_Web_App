# Use an official Node runtime as the base image
FROM node:18.3.0-alpine
# Set the working directory in the container to /app
WORKDIR /app
# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./
# Install app dependencies
RUN npm install
# Bundle app source inside Docker image
COPY . .
# Make port 8080 available to the outside
# This is the port that the app listens on
EXPOSE 8080
# Define the command to run the app
# This uses the definition in package.json
CMD ["npm", "start"]