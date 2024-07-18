all:
# Start the Docker containers
	docker compose -f ./docker-compose.yml up -d --build
# Wait for the nginx service to be available
	@while ! nc -z localhost 4000; do \
		sleep 0.1; \
	done
# Open the web page
	@xdg-open http://localhost:4000

clean:
	docker compose -f ./docker-compose.yml down
	docker system prune -af

re: clean all

logs_pong:
	docker logs pong_game

logs_ai:
	docker logs ai_opponent

logs_nginx:
	docker logs nginx