from django.db import models
from api.models import CustomUser

class Friend_Request(models.Model):
	from_user = models.ForeignKey(CustomUser, related_name='from_user', on_delete=models.CASCADE)
	to_user = models.ForeignKey(CustomUser, related_name='to_user', on_delete=models.CASCADE)

