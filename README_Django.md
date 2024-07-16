# PROJET DJANGO

Vu que pour transcendandce on doit respecter la consigne de la single page on n'utilisera pas Django exactement comme ça mais voici les 4 fichiers importants d'un projet Django :

## models.py

C'est dans ce fichier qu'on déclare des classes. \
Ex :

```python
class Stats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stats')
    nb_of_victories = models.fields.IntegerField()
    nb_of_defeats = models.fields.IntegerField()
```
- ***user*** est lié par ForeignKey à la classe User de la base de données de jess. Les lier ainsi me permet d'avoir une classe stats associée à chacun des joueurs. 
- À Part ***user***, on déclare ici le type de chaque variable (ex: IntegerField()) et on peut également y inserer des limites ou des options type "permettre de laisser cet variable vide à la création d'une nouvelle instance de classe. \
Ex:
```python
CharField(max_length=10, blank=True)
```

## views.py

C'est dans ce fichier qu'on déclare des "vues". Une vue est un mélange entre une fonction et une page web. \
Ex:
```python
def dashboard_view(request):
    users = User.objects.all()
    stats = Stats.objects.all().select_related('user')
    return render(request, 'dashboard.html',
				{'users': users, 'stats': stats})
```
- On déclare une vue ***dashboard_view*** qui peut prendre des paramètres (ici : request, la requête étant d'essayer d'ouvrir la page web associée à cette vue) et contient deux variables (users et stats qui sont de classe User et Stats). Cette view return une page html (pour afficher la page web associée à cette vue).
- ***select_related()*** permet de link la classe stats à la classe users (cf ForeignKey)

## urls.py

On indique dans cette page comment on veut que notre url s'appelle et à quoi il correspond.

```python
urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
]
```
Comme on a deux "applications" dans notre projet (l'application dashboard et l'appliation user_management) on a le fichier urls.py dans chacune de nos applications puis le fichier urls.py dans le dossier merchex :

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include('dashboard.urls')),  # Inclure les URLs de l'application dashboard
    path('login/', include('users_manager.urls')),  # Inclure les URLs de l'application users_manager
]
```
Ce bout de code signifie qu'on aura 3 paths possibles : \
http://127.0.0.1:8000/admin \
http://127.0.0.1:8000/dashboard --> affichera dashboard.html\
http://127.0.0.1:8000/login

## Dossier templates

C'est ici que se trouvent les fichiers :
- dashboard.html : notre page web
- base.html : contient des bouts de code communs à plusieurs fichiers html pour éviter de les réécrire en boucle (c'est des sorte de #define)
- styles.css : spécifie les styles utilisés dans tous les fichiers html. Ex: la balise html h1 (pour les titres) prendra la forme de texte rouge avec une taille 10 et une marge de 2cm.

&nbsp;

# VERSION SINGLE PAGE :

## views.py

On crée une vue qui retourne les données du tableau de bord en JSON:

```python
from django.http import JsonResponse
from .models import Stats

def get_dashboard_data(request):
	data = list(Stats.objects.all().values())
	return JsonResponse(data, safe=False)
```

## urls.py

On ajoute un url pour accéder à cette vue

```python
from django.urls import path
from . import views

urlpatterns = [
	path('api/dashboard/', views.get_dashboard_data, name='dashboard'),
]
```

## index.html (single page)

```html
<body>
	<div id="dashboard-container"></div>
	<script src="path to dashboard.js"></script>
</body>
```

- ***dashboard-container*** : id utilise dans dashboard_display.js pour recuperer les donnees statistiques
