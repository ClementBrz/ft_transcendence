# ft_transcendenceyh

## Modules we think would be nice to do

### Web
- Module majeur : Utiliser un framework en backend.
- Module mineur : Utiliser une base de données pour le backend -et plus.
- Module majeur : Stocker les pointages d’un tournoi dans la Blockchain. (a faire si y'a le temps)

### Gestion Utilisateur
- Module majeur : Gestion d’utilisateurs standard, authentification et utilisateurs en tournois.
- Module majeur : Implémenter une authentification à distance. (PEUT ETRE)

### Jouabilité et expérience utilisateur
- Module majeur : Joueurs à distance
- Module majeur : Clavardage en direct

### IA-Algo
- Module majeur : Adversaire contrôlé par IA.

### Cybersécurité
- Module majeur : Mise en place d’un pare-feu d’application Web (WAF) ou
ModSecurity avec une configuration renforcée et utilisez HashiCorp Vault pour la
gestion des secrets.
- Module mineur : Options de conformité au RGPD avec anonymisation des utilisateurs, gestion locale des données et suppression de compte.
- Module majeur : Implémenter l’authentification à 2 facteurs (2FA) et JWT.

### Devops
- Module majeur : Configuration de l’infrastructure avec ELK (Elasticsearch, Logstash, Kibana) pour la gestion des journaux (logs). (Clement le fera si y'a le temps)
- Module mineur : Système de monitoring (Clement le fera si y'a le temps)
- Module majeur : Design de backend en Microservices.

### Accessibilité
- Module mineur : Support sur tout type d’appareils.
- Module mineur : Support de multiples langues.

Majeurs = 11;
Mineurs = 5;

Total Majeurs = 13,5;

## Objectifs
	- créer un jeu pong
	- ce jeu doit être jouable contre un adversaire sur le même clavier ou à distance

&nbsp;

# STRUCTURE

- frontend
	- views
		- pong_game
			- 3d_game
				- `main.js`
				- `...`
			- ai_opponent
				- `ai.js`
			- personalization
				- `...`
		- `home.js`
		- `about_us.js`
		- `dashboard.js`
		- `login.js`
		- `...`
	- nginx
		- `index.html`
		- `dockerfile`
	- languages
		- `...`
- backend
	- django_databases
   		- django_web_app
	   		- merchex
				- dashboard_app
					- `models.py`
					- `views.py`
					- `urls.py`
				- user_manager_app
					- `models.py`
					- `views.py`
					- `urls.py`
	  			- merchex
					- `urls.py`
					- `settings.py`
	       		- `manage.py`
	       		- `requirements.txt`
        - `Dockerfile`
  		- `Makefile`
	- 2FA
		- `2fa.py`
	- browser_compatibility
		- `...`



	-

## Ressources
- https://openclassrooms.com/fr/courses/6573181-adoptez-les-api-rest-pour-vos-projets-web
- https://openclassrooms.com/fr/courses/4668056-construisez-des-microservices
- https://github.com/toddmotto/public-apis?tab=readme-ov-file#video
- https://www.youtube.com/watch?v=eIxDHgzGCnY
- https://www.youtube.com/watch?v=eesqK59rhGA
