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
	cd django_web_app/merchex && python manage.py runserver

.PHONY:	all clean re