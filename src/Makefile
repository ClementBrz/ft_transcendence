all :
	sudo docker compose up -d --build

clean : 
	sudo docker compose down

re : clean all

web : all
	xdg-open http://localhost:8080