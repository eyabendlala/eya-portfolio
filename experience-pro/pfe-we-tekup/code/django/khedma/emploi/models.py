from django.db import models
from enum import Enum
from users.models import UserAccount
from django.core.exceptions import ValidationError
# Define Enums for Region and Type
class Region(Enum):
    REGION_1 = "Tunis"
    REGION_2 = "Ariana"
    REGION_3 = "Ben Arous"
    REGION_4 = "Manouba"
    REGION_5 = "Nabeul"
    REGION_6 = "Zaghouan"
    REGION_7 = "Bizerte"
    REGION_8 = "Béja"
    REGION_9 = "Jendouba"
    REGION_10 = "Kef"
    REGION_11 = "Siliana"
    REGION_12= "Kairouan"
    REGION_13= "Sousse"
    REGION_14= "Monastir"
    REGION_15= "Mahdia"
    REGION_16= "Sfax"
    REGION_17= "Kasserine"
    REGION_18= "Sidi Bouzid"
    REGION_19= "Gabès"
    REGION_20= "Medenine"
    REGION_21= "Tataouine"
    REGION_22= "Gafsa"
    REGION_23= "Tozeur"
    REGION_24= "Kebili"
    @classmethod
    def choices(cls):
        return [(member.value, member.value) for member in cls]
  

class Type(Enum):
    TYPE_1 = "Court"
    TYPE_2 = "Moyen"
    TYPE_3 = "Durable"
    @classmethod
    def choices(cls):
        return [(member.value, member.value) for member in cls]

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, null= True)
    description = models.CharField(max_length=300, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    # Add other fields as needed

    class Meta:
        db_table = 'categorie'

    def __str__(self):
        return self.nom

class Emploi(models.Model):
    idEmploi = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=100)
    description = models.TextField()
    date_postulation = models.DateField()
    date_expiration = models.DateField()
    duree_offre = models.CharField(max_length=50)
    genre_demande = models.CharField(max_length=50)
    intervalle_age = models.CharField(max_length=20)
    localisation  = models.CharField(max_length=100)
    montant_paiement = models.CharField(max_length=250)
    image_emploi = models.ImageField(upload_to='emplois/',null=True, blank=False)  # Make sure you have the 'Pillow' library installed for image fields
    experience = models.CharField(max_length=100)
    region = models.CharField(max_length=20, choices=Region.choices())
    type_emploi = models.CharField(max_length=20, choices=Type.choices())
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  # Assuming you have imported the User model from Django's auth module
    categories = models.ManyToManyField(Categorie)
    is_archived = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'emploi'
    
    def __str__(self):
        return self.titre




# Définissez le modèle Favoris
class Favoris(models.Model):

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  
    emploi = models.ForeignKey(Emploi, on_delete=models.CASCADE)
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'emploi')

    def __str__(self):
        return f"{self.user} - {self.emploi}"
    

class Application(models.Model):

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  
    emploi = models.ForeignKey(Emploi, on_delete=models.CASCADE)
    applied_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=64, default='pending')