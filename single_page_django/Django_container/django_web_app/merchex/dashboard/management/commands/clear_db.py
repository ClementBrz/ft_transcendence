from django.core.management.base import BaseCommand
from jess.models import User
from dashboard.models import Stats

class Command(BaseCommand):
    help = 'Deletes all users and their associated stats'

    def handle(self, *args, **kwargs):
        # Delete all stats first (to maintain referential integrity)
        Stats.objects.all().delete()
        # Then delete all users
        User.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Successfully deleted all users and stats'))


#run "python manage.py clear_db" before "python manage.py runserver"
