# Generated by Django 4.2.2 on 2024-04-03 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('emploi', '0005_alter_emploiplus_heure_debut_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='emploiplus',
            name='status',
        ),
    ]
