# Generated by Django 4.2.16 on 2024-10-03 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friends', '0005_alter_friendrequest_request_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendrequest',
            name='request_status',
            field=models.CharField(choices=[('pending', 'PENDING'), ('accepted', 'ACCEPTED'), ('rejected', 'REJECTED'), ('friendship_ended', 'FRIENDSHIP_ENDED')], default='pending', max_length=16),
        ),
    ]
