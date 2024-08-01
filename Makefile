#TODO: le makefile devrait installer docker s'il ne figure pas deja sur l'ordi, sinon
#la commande docker-compose ne marchera pas

# Default target to build and start the containers
all:
	cd src && docker-compose up -d --build

# Target to stop and remove containers, and clean up unused Docker resources
clean:
	cd src && docker-compose down
	docker system prune -af

# Rebuild and restart the containers
re: clean all

# Open the web application in Google Chrome's incognito mode
web: all
	google-chrome --incognito http://localhost:8080


# View logs for all services
logs:
	cd src && docker-compose logs

# View logs for the nginx service
logs-nginx:
	cd src && docker-compose logs nginx

# View logs for the profile service
logs-profile:
	cd src && docker-compose logs profile

# View logs for the dashboard service
logs-dashboard:
	cd src && docker-compose logs dashboard

.PHONY: all clean re web logs logs-nginx logs-profile logs-dashboard
