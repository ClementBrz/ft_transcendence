-- Pour que le container PostgreSQL se lance correctement, il faut que le fichier init.sql soit présent dans le dossier /docker-entrypoint-initdb.d/ du container.

-- Create the database
CREATE DATABASE mydatabase;

-- Create the user with password
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;