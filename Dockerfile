# Stage 1: Build Stage
FROM node:20-alpine3.20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

###################################################################################################

# Stage 2: Using distroless image
FROM gcr.io/distroless/nodejs20-debian12

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/node_modules .
COPY --from=build /app .

# Expose port
EXPOSE 5000

# Run the application
CMD ["./src/server.js"]
