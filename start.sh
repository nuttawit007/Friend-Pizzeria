#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found! Please create the .env file first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run Prisma commands
echo "Running Prisma commands..."
npx prisma generate
npx prisma db push

# Start the Node.js server
echo "Starting the server..."
node index.js
