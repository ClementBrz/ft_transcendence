from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True) #id est une colonne qui existe par default dans Django
    name = models.fields.CharField(max_length=100, null=True)
    nickname = models.CharField(max_length=100, null=True)

