from django.core.management.base import BaseCommand
from base.models import Stats


class Command(BaseCommand):
    help = 'Deletes all users and their associated stats'

    def handle(self, *args, **kwargs):
        # Delete all stats
        Stats.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Successfully deleted all users and stats'))


#run "python manage.py clear_db" before "python manage.py runserver"
