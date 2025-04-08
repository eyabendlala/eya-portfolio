from django.db import models
from users.models import UserAccount

class Event(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='event_images/')
    description_event = models.TextField(null=True)
    date_expiration = models.DateTimeField(null=True)
    lien = models.URLField(null=True)
    secteur = models.ManyToManyField('Secteur') # Modification ici
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    is_archived = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Secteur(models.Model):
    nom = models.CharField(max_length=100)
    description = models.CharField(max_length=300, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="enfants")

    class Meta:
        db_table = 'secteur'

    def __str__(self):
        return self.nom








class Participation(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"





