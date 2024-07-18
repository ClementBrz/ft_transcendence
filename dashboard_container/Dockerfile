FROM	python:3.10


RUN		apt update && apt upgrade -y
#Install PostgreSQL dependencies
RUN		apt install -y libpq-dev

# Copy the current directory contents into the container at /app
COPY dashboard /app
# Set the working directory to /app
WORKDIR /app

#Install django and its depenencies
# RUN		pip install -r requirements.txt

#voir avec les autres quel port
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the command to start uWSGI
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]