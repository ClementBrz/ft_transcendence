FROM nginx:latest

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

COPY ./frontend /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html/*
RUN chown -R www-data:www-data /usr/share/nginx/html/*

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# localhost:8080