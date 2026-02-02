FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# App port
EXPOSE 8000

# Start command
CMD [ "npm", "start" ]
