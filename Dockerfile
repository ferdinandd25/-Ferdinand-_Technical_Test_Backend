FROM node:16.13-slim

# Install dependencies
WORKDIR /app
COPY package*.json ./

# Install global dependencies for bcrypt
RUN apt-get update && apt-get install -y procps python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm install

# Install the NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy source files
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
