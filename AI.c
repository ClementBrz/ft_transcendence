//sudo apt-get install libmicrohttpd-dev libcjson-dev

#include <stdio.h>
#include <stdlib.h>
#include <strings.h>
#include <curl/curl.h>
#include <cjson/cJSON.h>

#define DOWN 0
#define UP 1


#define GAME_API_URL "http://jeu_pong:5000" //à changer en fonction du porrt nginx

typedef struct
{
	// int ball_x; //pas sûre d'en avoir besoin
	int ball_y;
	int ball_speed_x;
	int ball_speed_y;
	int paddle_speed; //depend du difficulty_level
	int paddle_x;
	int paddle_y;
	int field_x;
	int field_y;
	//etc
} GameData;

/*Chaque fois que des données sont reçues du serveur (par exemple, en 
réponse à une requête GET), libcurl appelle cette fonction pour traiter 
ces données.
- *void ptr : Pointeur vers les données reçues.
- size_t size : Taille d'un bloc de données.
- size_t nmemb : Nombre de blocs de données.
- *char data : Pointeur vers le buffer où les données doivent être écrites.*/
size_t	write_callback(void *ptr, size_t size, size_t nmemb, char *data) {
	strncat(data, ptr, size * nmemb);
	return size * nmemb;
}

GameData	get_game_data() {
	CURL *curl;
	CURLcode res;
	char data[4096] = {0};

	curl = curl_easy_init();
	if(curl) {
		curl_easy_setopt(curl, CURLOPT_URL, GAME_API_URL "/game_state");
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, data);
		res = curl_easy_perform(curl);
		curl_easy_cleanup(curl);
	}

	cJSON *json = cJSON_Parse(data);
	GameData data;
	cJSON *ball_position = cJSON_GetObjectItem(json, "ball_position");
	cJSON *paddle_speed = cJSON_GetObjectItem(json, "paddle_speed");

	data.ball_x = cJSON_GetObjectItem(ball_position, "x")->valueint;
	data.ball_y = cJSON_GetObjectItem(ball_position, "y")->valueint;
	data.paddle_speed = cJSON_GetObjectItem(paddle_speed, "paddle_speed")->valueint;

/* Dans json on a donc créé cela :

{
  "ball_position": {
	"x": 15,
	"y": 25
  },
  "paddle_speed": 5
}

*/
	cJSON_Delete(json); /* une fois l'info json parsee, et ses infos
	mises dans nos variables en C, on peut supprimer l'objet json */
	return data;
}

/* Prend en parametres l'action (le movement du paddle apres calculs de l'IA)
et donc renvoie la nouvelle position du paddle IA au jeu pour etre affiche */
void	send_ai_action(int action) {
	CURL *curl;
	CURLcode res;
	char json_data[128];

	snprintf(json_data, sizeof(json_data), "{\"action\": %d}", action);

	curl = curl_easy_init();
	if(curl) {
		curl_easy_setopt(curl, CURLOPT_URL, GAME_API_URL "/ai_action");
		curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
		curl_easy_perform(curl);
		curl_easy_cleanup(curl);
	}
}

int	 predict_ball_paddle_intersection(int ball_y)
{
	int intersectionX = field_x / 2 - paddle_x / 2;
	int intersectionY; //value we are looking for

	int distanceToIntersection = intersectionX - ball_x;
	int timeToIntersection = distanceToIntersection / ball_speed_x;
	
	int intersectionWithoutRebounds = ball_y + (ball_speed_y * timeToIntersection);

	//if no rebounds
	if (intersectionWithoutRebounds > field_y / 2 || intersectionWithoutRebounds < - field_y / 2) //if current pos + vertical displacement < field height == no rebounds
			intersectionY = intersectionWithoutRebounds;
	else //if rebounds
	{
			//intersectionY = intersectionWithoutRebounds % (2 * FIELD_HEIGHT); //if only one rebound?
			intersectionY = intersectionWithoutRebounds;
			if (intersectionY > field_y / 2) //means the ball is going back down after bounce
				intersectionY = - (intersectionY - field_y / 2); //we substract the excess
			else
				intersectionY = (intersectionY + field_y / 2); //we substract the excess
	}

	// if (intersectionY > FIELD_WIDTH / 2) //car sinon le paddle loupe souvent la balle de peu
	// 	intersectionY = intersectionY + (BALL_RADIUS * 2);
	// else
	// 	intersectionY = intersectionY - (BALL_RADIUS * 2);

	return intersectionY;
}

int	 decide_paddle_movement(int paddle_y, int predicted_intersection)
{
	if (paddle_y < predicted_intersection)
		paddle_y++;
	else if (paddle_y > predicted_intersection)
		paddle_y--;
	//else : on bouge pas
}

int	ai_action(GameData data) {
	// reprendre logique IA du jeu 3d et non 2d car differents noms de variables
	int predicted_intersection = predict_ball_paddle_intersection(data.ball_y);
	int paddle_movement = decide_paddle_movement(data.paddle_y, predicted_intersection); //UP ou DOWN (voie define)
	return paddle_movement;
}

void	init_static_variables(GameData *data, time_t *last_time)
{
	if (data == NULL)
		data = get_game_data();
	if (last_time == NULL)
		last_time = time(NULL);
}
	

/* Requests the game info needed (the ball's position) once per second
and send backs continuously the position of the AI palet to be displayed. */
int	main()
{
	static GameData data = NULL;
	static time_t last_time = NULL; //TODO : faire en sorte de l'init que la premiere fois qu'on nete dans la fonction

	init_static_variables(&data, &last_time);

	while(1)
	{
		time_t current_time = time(NULL);
		if (difftime(current_time, last_time) >= 1.0) //une fois par seconde
		{
			data = get_game_data();
			last_time = current_time;
		}

		int paddle_movement = ai_action(data);
		send_ai_action(paddle_movement); /*send un int (position) et en fonction de 
		la position voulue on simule les clicks dans le jeu*/
		usleep(1000);
	}
	return 0;
}
