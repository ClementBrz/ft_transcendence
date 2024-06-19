//sudo apt-get install libmicrohttpd-dev libcjson-dev

#include <stdio.h>
#include <stdlib.h>
#include <strings.h>
#include <curl/curl.h>
#include <cjson/cJSON.h>


#define GAME_API_URL "http://jeu_pong:5000" //à changer en fonction du porrt nginx

typedef struct {
    int ball_x; //pas sûre d'en avoir besoin
    int ball_y;
    int paddle_speed
    //etc
} GameData;

/*Chaque fois que des données sont reçues du serveur (par exemple, en 
réponse à une requête GET), libcurl appelle cette fonction pour traiter 
ces données.
- *void ptr : Pointeur vers les données reçues.
- size_t size : Taille d'un bloc de données.
- size_t nmemb : Nombre de blocs de données.
- *char data : Pointeur vers le buffer où les données doivent être écrites.*/
size_t write_callback(void *ptr, size_t size, size_t nmemb, char *data) {
    strncat(data, ptr, size * nmemb);
    return size * nmemb;
}

GameData get_game_data() {
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
    cJSON_Delete(json);
    return data;
}

void send_ia_action(int action) {
    CURL *curl;
    CURLcode res;
    char json_data[128];

    snprintf(json_data, sizeof(json_data), "{\"action\": %d}", action);

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, GAME_API_URL "/ia_action");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
}

int ai_movement(GameData data) {
    int predicted_intersection;
    // reprendre logique IA du jeu 3d et non 2d car differents noms de variables
    int new_paddle_position = predicted_intersection;
    return action;
}

int main() {
    while(1) {
        GameData data = get_game_data();
        int ai_paddle_position = ai_movement(data);
        send_ia_action(action);
        sleep(1); // Pause pour limiter la fréquence des requêtes
    }
    return 0;
}