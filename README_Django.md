4 fichiers importants :

# models.py

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

# views.py

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

# urls.py

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
    path('dashboard/', include('dashboard.urls')),  # Inclure les URLs de l'application caro
    path('jess/', include('jess.urls')),  # Inclure les URLs de l'application jess
]
```

http://127.0.0.1:8000/dashboard