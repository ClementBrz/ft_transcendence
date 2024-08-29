from django.core.management.base import BaseCommand
from base.models import CustomUser


class Command(BaseCommand):
    help = 'Deletes all users and their associated users'

    def handle(self, *args, **kwargs):
        # Delete all users
        CustomUser.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Successfully deleted all users and users'))


#run "python manage.py clear_db" before "python manage.py runserver"
