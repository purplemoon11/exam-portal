FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) for npm install
COPY package.json .
COPY package-lock.json* ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Command to run the application using npm run dev
CMD ["npm", "run", "dev"]
