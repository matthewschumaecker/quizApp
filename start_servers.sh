#!/bin/zsh
echo "Starting the frontend and backend servers..."
# Navigate to the frontend directory and start the development server
cd frontend/ || exit
npm run dev &

# Navigate to the backend directory and start the backend server with nodemon
cd ../backend || exit
nodemon server.js
