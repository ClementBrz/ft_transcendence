from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
from .user_management.api_user.models import CustomUser

@shared_task
def delete_inactive_users():
    # Time
    three_years_ago = timezone.now() - timedelta(days=3 * 365)
    warning_threshold = timezone.now() - timedelta(days=(3 * 365 - 90))

    # Users
    users_to_delete = CustomUser.objects.filter(last_login__lt=three_years_ago)
    users_to_warn = CustomUser.objects.filter(last_login__lt=warning_threshold, last_login__gte=three_years_ago)

    # Delete inactive users
    for user in users_to_delete:
        user.delete()

    # Warn users about upcoming deletion
    for user in users_to_warn:
        send_warning_email(user)

def send_warning_email(user):
    subject = 'PONG - Your account will be deleted soon due to inactivity'
    message = '''
    Hi {},

    It seems you haven't logged into your account for a while.
    Your account will be permanently deleted in 3 months if no activity is detected.

    If you wish to keep your account, please log in within the next 3 months.

    Best regards,
    Django Déchainés
    '''.format(user.username)

    send_mail(
        subject,
        message,
        'traans.een.daance@gmail.com',
        [user.email],
        fail_silently=False,
    )