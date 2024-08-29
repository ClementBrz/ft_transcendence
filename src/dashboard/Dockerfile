FROM	python:3.10

RUN		apt update && apt upgrade -y

# Set the working directory
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY initiation_files/django_conf/requirements.txt /app/initiation_files/django_conf/requirements.txt



########### ˇ Install the dependencies ˇ ###########

#Install django and its dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install -r /app/initiation_files/django_conf/requirements.txt
RUN apt install postgresql -y
RUN	apt install libpq-dev -y

# Install Django Channels pour les websockets (savoir quel user est connecté)
RUN pip install channels_redis
RUN pip install channels

# Install Python Dotenv for managing environment variables
RUN pip install python-dotenv==1.0.1

# Install Faker for generating fake data
# RUN pip install faker


########### ^ Install the dependencies ^ ###########



# Copy the entrypoint script for PostgreSQL
COPY ../initiation_files/postgresql_conf/pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
RUN chmod 777 /etc/postgresql/15/main/pg_hba.conf

# Copy the initiation file for PostgreSQL
COPY ../initiation_files/postgresql_conf/init_database.sh /tmp/init_database.sh
RUN chmod 777 /tmp/init_database.sh



# Copy the rest of the application code
COPY dashboard/dashboard/ /app
RUN chmod -R 777 /app

# Voir avec les autres quel port
EXPOSE 8100
EXPOSE 5432

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the command to start uWSGI
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]