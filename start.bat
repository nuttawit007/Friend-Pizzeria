@echo off
title Node.js Server Setup

:: Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found! Please create the .env file first.
    pause
    exit /b
)

:: Install dependencies
echo [INFO] Installing dependencies...
call npm install || (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] node_modules directory is missing! Dependencies may not have installed correctly.
    pause
    exit /b
)

:: Check Prisma installation
echo [INFO] Checking Prisma installation...
call npx prisma --version || (
    echo [ERROR] Prisma is not installed. Installing now...
    call npm install @prisma/client prisma --save-dev || (
        echo [ERROR] Failed to install Prisma!
        pause
        exit /b
    )
)

:: Run Prisma commands
echo [INFO] Running Prisma commands...
call npx prisma generate || (
    echo [ERROR] Failed to generate Prisma Client!
    pause
    exit /b
)

call npx prisma db push || (
    echo [ERROR] Failed to push database schema!
    pause
    exit /b
)

:: Start the Node.js server
echo [INFO] Starting the server...
call node index.js || (
    echo [ERROR] Failed to start the server!
    pause
    exit /b
)

:: Keep the window open
pause
