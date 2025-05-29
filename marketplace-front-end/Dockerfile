# Use official Node.js 18 image as the base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN NEXT_DISABLE_ESLINT=1 npm run build

# Start the app in production mode
EXPOSE 3000
CMD ["npm", "start"] 