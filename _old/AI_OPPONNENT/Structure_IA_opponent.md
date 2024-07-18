Créer un système où l'opposant IA communique avec le jeu de Pong via des requêtes API, en utilisant Docker et Nginx, permettant ainsi de séparer le jeu de pong et l'IA en différents fichiers.

# 1. Structure

***jeu_pong/*** : Répertoire contenant le jeu Pong.\
***jeu_pong.py*** : Script principal du jeu Pong.\
***requirements.txt***: Dépendances Python nécessaires pour le jeu.\
***ia_pong/*** : Répertoire contenant l'IA pour jouer au Pong.\
***ia_pong.py*** : Script principal de l'IA.\
***requirements.txt*** : Dépendances Python nécessaires pour l'IA.\
***docker/*** : Répertoire contenant les configurations Docker et Nginx.\
***Dockerfile.pong*** : Dockerfile pour le jeu Pong.\
***Dockerfile.ia*** : Dockerfile pour l'IA.\
***nginx.conf*** : Configuration pour Nginx.\
***docker-compose.yml*** : Fichier de composition Docker pour orchestrer les conteneurs.

# 2. Jeu Pong
### jeu_pong.py
Dans le script du jeu Pong, mettre en place un serveur API pour envoyer les données du jeu et recevoir les actions de l'IA.

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Exemple de variables de jeu
ball_position = {"x": 0, "y": 0}
player_position = {"x": 0, "y": 0}
ia_position = {"x": 0, "y": 0}

@app.route('/game_state', methods=['GET'])
def get_game_state():
    return jsonify({
        "ball_position": ball_position,
        "player_position": player_position,
        "ia_position": ia_position
    })

@app.route('/ia_action', methods=['POST'])
def post_ia_action():
    action = request.json.get('action')
    # Met à jour le jeu en fonction de l'action de l'IA
    # Par exemple: ia_position['x'] += action
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

# 3. IA Pong
### ia_pong.py
Dans le script de l'IA, mettre en place un client pour interroger l'API du jeu et envoyer les actions de l'IA.

```python
import requests
import time

GAME_API_URL = 'http://jeu_pong:5000'

def get_game_state():
    response = requests.get(f"{GAME_API_URL}/game_state")
    return response.json()

def send_ia_action(action):
    requests.post(f"{GAME_API_URL}/ia_action", json={"action": action})

def ia_logic(game_state):
    # Logique de l'IA pour déterminer l'action
    action = 1  # Exemple d'action
    return action

while True:
    game_state = get_game_state()
    action = ia_logic(game_state)
    send_ia_action(action)
    time.sleep(0.1)  # Pause pour limiter la fréquence des requêtes
```

# 4. Docker et Nginx
## 4.1 Dockerfiles
### Dockerfile.pong
```dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY jeu_pong/ ./
RUN pip install -r requirements.txt
CMD ["python", "jeu_pong.py"]
```
### Dockerfile.ia
```dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY ia_pong/ ./
RUN pip install -r requirements.txt
CMD ["python", "ia_pong.py"]
```
## 4.2 Nginx Configuration
### nginx.conf

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://jeu_pong:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
## 4.3. Docker Compose
### docker-compose.yml
```yaml
version: '3'
services:
  jeu_pong:
    build:
      context: .
      dockerfile: docker/Dockerfile.pong
    container_name: jeu_pong
    ports:
      - "5000:5000"

  ia_pong:
    build:
      context: .
      dockerfile: docker/Dockerfile.ia
    container_name: ia_pong

  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "4000:4000"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - jeu_pong
```
# 5. Démarrage du Projet
### Makefile
Mettre le Makefile dans le même r'epertoire que docker-compose.yml :
```bash
docker-compose build
docker-compose up
```

# 6. Explication du Fonctionnement
C***ommunication API ***: Le jeu Pong expose une API Flask pour envoyer l'état du jeu (/game_state) et recevoir les actions de l'IA (/ia_action).\
***Client IA*** : L'IA interroge régulièrement l'API du jeu pour obtenir l'état actuel du jeu et détermine l'action à effectuer, qu'elle envoie ensuite au jeu via une requête POST.\
***Docker*** : Les Dockerfiles définissent l'environnement nécessaire pour exécuter le jeu et l'IA, chacun dans son propre conteneur.\
***Nginx*** : Nginx agit comme un proxy inversé pour diriger les requêtes vers le serveur Flask du jeu Pong.\
***Docker Compose*** : Orchestration des conteneurs pour s'assurer que le jeu et l'IA fonctionnent ensemble correctement.\
Cette architecture permet de séparer le code du jeu et de l'IA, tout en les faisant communiquer via des requêtes HTTP.