@echo off
echo Installing dependencies...
npm install

echo Running Prisma commands...
npx prisma generate
npx prisma db push

echo Starting the server...
node index.js

pause
