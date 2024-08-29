from django.core.management.base import BaseCommand
from api.models import CustomUser
from faker import Faker
import random
import string

# Generate a random username with 8 letters
username = ''.join(random.choices(string.ascii_letters, k=8))
nb_of_victories = random.randint(0, 100)

fake = Faker()

def generate_random_username(length=8):
    return ''.join(random.choices(string.ascii_letters, k=length))

# Generating a random number of friends between 1 and 10
num_friends = random.randint(1, 10)
friends_list = [generate_random_username() for _ in range(num_friends)]



class Command(BaseCommand):
    help = 'Populates the database with random user and User data'

    def handle(self, *args, **kwargs):
        for _ in range(10):
            CustomUser.objects.create(
                username=''.join(random.choices(string.ascii_letters, k=8)),
                display_name=''.join(random.choices(string.ascii_letters, k=8)),
                password=''.join(random.choices(string.ascii_letters, k=8)),
                email=''.join(random.choices(string.ascii_letters, k=8)),
                online=random.choice([True, False]),
                friends=friends_list,
            )
        self.stdout.write(self.style.SUCCESS('Successfully populated the database'))

#run "python manage.py populate_db" before "python manage.py runserver"

