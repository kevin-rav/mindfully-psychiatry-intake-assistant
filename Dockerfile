# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and lock file first to leverage Docker cache
COPY package.json package-lock.json ./

# Ensure fresh install inside the container
RUN rm -rf node_modules && npm ci

# Copy the rest of the application
COPY . .

RUN npx prisma generate

# Build the application
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
