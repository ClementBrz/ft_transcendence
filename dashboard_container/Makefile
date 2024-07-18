IMAGE_NAME=database_img
CONTAINER_NAME=database_container

ball :
# Build the Docker image
	docker build -t $(IMAGE_NAME) .
# Run the Docker container
	docker run --name $(CONTAINER_NAME) -d -p 8000:8000 $(IMAGE_NAME)
	
# Stop and remove the Docker container
clean:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

re : clean build run

web :
	cd dashboard && python manage.py runserver

#for tests : import random data into database and suppress it
populate_db :
	cd dashboard && python manage.py populate_db
clear_db :
	cd dashboard && python manage.py clear_db

migrations :
	cd dashboard && python manage.py makemigrations && python manage.py migrate

.PHONY:	all clean re