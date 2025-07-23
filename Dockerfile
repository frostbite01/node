# Use Node.js LTS version
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install wait-for-it
RUN apt-get update && apt-get install -y wait-for-it

# Install app dependencies
# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Use wait-for-it to wait for MySQL
CMD ["wait-for-it", "db:3306", "--", "npm", "start"] 