#!/bin/bash

# Start the Docker containers
docker-compose up -d

# Wait for the nginx service to be available
while ! nc -z localhost 4000; do   
  sleep 0.1 # wait for 1/10 of the second before check again
done

# Open the web page
xdg-open http://localhost:4000