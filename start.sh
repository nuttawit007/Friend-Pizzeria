#!/bin/bash

# Set script to exit on any command failure
set -e

echo "🔍 Checking for .env file..."
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found! Please create the .env file first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking Prisma installation..."
if ! npx prisma --version > /dev/null 2>&1; then
    echo "⚠️ Prisma not found! Installing Prisma..."
    npm install @prisma/client prisma --save-dev
fi

echo "⚙️ Running Prisma commands..."
npx prisma generate
npx prisma db push

echo "🚀 Starting the server..."
node index.js
