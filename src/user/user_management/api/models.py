from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.core.files import File
from django.conf import settings
import os


class CustomUser(AbstractUser):
    username = models.CharField(blank=False, null=False, max_length=12, unique=True)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    password = models.CharField(blank=False, null=False, max_length=50)
    email = models.EmailField(blank=False, null=False, unique=True)
    birth_date = models.DateTimeField(blank=True)
    friends = models.ManyToManyField("CustomUser", blank=True)
    # avatar = models.ImageField(blank=True, upload_to='avatars/')
    # is_online = models.BooleanField(default=True)
    # is_2fa = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )



# @receiver(pre_save, sender=CustomUser)
# def set_default_avatar(sender, instance, **kwargs):
# 	if not instance.avatar:
# 		default_avatar_path = os.path.join(settings.API_DIR, 'static', 'avatars', 'default.png')
# 		with open(default_avatar_path, 'rb') as f:
# 			default_avatar = File(f)
# 			var = instance.avatar.save('default.png', default_avatar, save=False)
