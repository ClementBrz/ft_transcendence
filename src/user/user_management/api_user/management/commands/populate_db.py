from django.core.management.base import BaseCommand
from api_user.models import CustomUser

#********************************************
#			ADD MANUALLY ENTERED USERS		#
#********************************************

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        predefined_data = [
        {
            'username': 'Karl',
            'password': 'pass123',
            'email': 'karl@email.com',
            'date_of_birth': '1992-09-29',
            'first_name': 'Karl',
            'last_name': 'Querel',
        },
        {
            'username': 'Clément',
            'password': 'pass123',
            'email': 'clément@email.com',
            'date_of_birth': '1997-01-28',
            'first_name': 'Clément',
            'last_name': 'Bernazeau',
        },
        {
            'username': 'Carolina',
            'password': 'pass123',
            'email': 'carolina@email.com',
            'date_of_birth': '1997-07-04',
            'first_name': 'Carolina',
            'last_name': 'Somarriba',
        },
        {
            'username': 'Jess',
            'password': 'pass123',
            'email': 'jess@email.com',
            'date_of_birth': '1994-05-13',
            'first_name': 'Jessica',
            'last_name': 'Rouillon',
        },
    ]

        # Iterate over predefined data and create entries in the database
        for user_data in predefined_data:
            user = CustomUser.objects.create_user(
				username=user_data['username'],
				password=user_data['password'],
                email=user_data['email'],
                date_of_birth=user_data['date_of_birth'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
			)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with predefined user data'))