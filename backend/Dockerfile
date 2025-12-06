# Shreevid AI Backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including stripe
RUN npm ci --only=production

# Copy source code
COPY . ./

# Create uploads directory
RUN mkdir -p uploads/audio uploads/videos uploads/final

# Expose port
EXPOSE 8080

ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google-tts-service-account.json

CMD ["node", "server.js"]
