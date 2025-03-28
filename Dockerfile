# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript as a dev dependency
RUN npm install typescript --save-dev

# Copy the rest of the application code
COPY . .

# Compile TypeScript files into JavaScript
RUN npx tsc

# Expose the application port
EXPOSE 5713

# Start the application using the compiled JavaScript file
CMD ["node", "dist/index.js"]