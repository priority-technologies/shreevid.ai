# Shreevid AI - Backend Dockerfile for Google Cloud Run

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy Google Cloud credentials
COPY backend/credentials/ /app/credentials/

# Create uploads directory
RUN mkdir -p uploads/audio uploads/videos uploads/final

# Expose port (Cloud Run will use PORT env variable)
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Set credentials path for Google Cloud
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-tts-service-account.json

# Start the application
CMD ["node", "server.js"]
