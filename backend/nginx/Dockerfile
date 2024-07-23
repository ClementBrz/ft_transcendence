FROM nginx:latest

RUN apt install curl -y

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

COPY ./frontend/all_javascript /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html/*

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# localhost:8080