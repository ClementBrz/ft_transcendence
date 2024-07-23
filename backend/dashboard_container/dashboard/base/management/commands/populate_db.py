from django.core.management.base import BaseCommand
from base.models import Stats
from faker import Faker
import random
import string

# Generate a random username with 8 letters
username = ''.join(random.choices(string.ascii_letters, k=8))
nb_of_victories = random.randint(0, 100)

fake = Faker()

class Command(BaseCommand):
    help = 'Populates the database with random user and stats data'

    def handle(self, *args, **kwargs):
        for _ in range(10):
            Stats.objects.create(
                username=''.join(random.choices(string.ascii_letters, k=8)),
                nb_of_victories=random.randint(0, 100),
                nb_of_defeats=random.randint(0, 100),
                badge=random.randint(0, 4),
                ranking_position=random.randint(1, 1000),
                nb_of_games_played=random.randint(0, 200)
            )
        self.stdout.write(self.style.SUCCESS('Successfully populated the database'))

#run "python manage.py populate_db" before "python manage.py runserver"

