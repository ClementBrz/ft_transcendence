#######		COLORS		#######
GREEN = \033[0;32m
RED = \033[0;31m
NC = \033[0m

#######		GENERAL RULES		#######
all :
	@cd src && docker-compose up -d --build
	@make fill_db
	@echo "$(GREEN)\n✨ Ft_Transcendence is ready and running on https://localhost:4430 ✨\n$(NC)"

clean :
#if Dashboard and User databases are up, clear it
	@if (docker ps --filter "name=Dashboard" --filter "status=running" | grep -q Dashboard) && (docker ps --filter "name=User" --filter "status=running" | grep -q User); then \
		make clear_db; \
	fi
	@find . -name "*.pyc" -delete
	@cd src && docker-compose down --remove-orphans

fclean : clean
	cd src && docker system prune -af
	cd src && docker volume prune -af
	@echo "$(GREEN)\n🛁✨ All containers test, networks, volumes and images have been removed ✨🛁\n$(NC)"

re : fclean all


#######		DJANGO		#######

# Apply changes to database

makemigrations_dashboard:
	docker exec -it Dashboard bash -c "python manage.py makemigrations && python manage.py migrate"

# Populate database with pre-defined users and games

fill_db:
	docker exec -it User bash -c "python manage.py makemigrations && python manage.py migrate && python manage.py populate_user_db"
	docker exec -it Dashboard bash -c "python manage.py makemigrations && python manage.py migrate && python manage.py populate_dashboard_db"

# Check database

check_allUsers:
	docker exec -it Database bash -c "psql -U postgres -d pong_database -c 'SELECT * FROM api_user_customuser;'"

check_allGameHistory:
	docker exec -it Database bash -c "psql -U postgres -d pong_database -c 'SELECT * FROM api_dashboard_gamehistory;'"

check_userGamehistory:
	@read -p "Enter username: " username; \
	docker exec -it Database bash -c "psql -U postgres -d pong_database -c \"SELECT * FROM api_dashboard_gamehistory WHERE \\\"myUsername\\\" = '$$username';\""

check_allFriendRequests:
	docker exec -it Database bash -c "psql -U postgres -d pong_database -c 'SELECT * FROM friends_friendrequest;'"

check_allFriends:
	docker exec -it Database bash -c "psql -U postgres -d pong_database -c 'SELECT * FROM api_user_customuser_friends;'"

# Clear database

clear_db:
	docker exec -it Dashboard bash -c "python manage.py makemigrations && python manage.py migrate && python manage.py clear_dashboard_db"
	docker exec -it User bash -c "python manage.py makemigrations && python manage.py migrate && python manage.py clear_user_db"


.PHONY: all clean fclean re check_allGameHistory check_userGamehistory check_allUsers fill_db clear_db makemigrations_dashboard check_allFriendRequests check_allFriends