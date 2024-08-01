from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.core.files import File
from django.conf import settings
import os


class CustomUser(AbstractUser):
    username = models.CharField(blank=False, null=False, max_length=12, unique=True)
    display_name = models.CharField(max_length=12)
    password = models.CharField(blank=False, null=False, max_length=50)
    email = models.EmailField(blank=False, null=False, unique=True)
    avatar = models.ImageField(blank=True, upload_to='avatars/')
    is_online = models.BooleanField(default=True)
    friends = models.ManyToManyField("CustomUser", blank=True)
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



@receiver(pre_save, sender=CustomUser)
def set_default_avatar(sender, instance, **kwargs):
	if not instance.avatar:
		default_avatar_path = os.path.join(settings.BASE_DIR, 'static', 'avatar', 'default.png')
		with open(default_avatar_path, 'rb') as f:
			default_avatar = File(f)
			var = instance.avatar.save('default.png', default_avatar, save=False)
