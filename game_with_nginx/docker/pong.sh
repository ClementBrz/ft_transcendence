#!/bin/bash

cd pong_game

npm install three
npm run dev

# Keep the container running after the script finishes
exec "$@"