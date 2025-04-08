from django.db import models
import django.utils.timezone
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from enum import Enum

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError("Utilisateur doit avoir une adresse email")

        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)

        user.set_password(password)
        user.save()

        if role == "employeur":
            personne = Personne.objects.create(user=user)

        elif role == "societe":
            societe = Societe.objects.create(user=user)
        elif role == 'candidat':
            personne = Personne.objects.create(user=user)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin') 

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        user = self.create_user(email, password, **extra_fields)
        # Create the associated Personne instance
        nom = input('Nom: ')
        prenom = input('Prénom: ')
        #date_naissance=input('date_naissance:')
        genre= input('genre: ')
    

        personne = Personne.objects.create(user=user, nom=nom, prenom=prenom,genre=genre)


        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('societe', 'Societe'),
        ('employeur', 'Employeur Individuel'),
        ('candidat', 'Candidat'),
        ('admin','Admin'),
    )

    email = models.EmailField(max_length=255, unique=True)
    adresse = models.CharField(max_length=255)
    identifiant=models.CharField(max_length=255,default="123")
    numero_telephone = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    nationalite = models.CharField(max_length=80)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    registration_date = models.DateTimeField(default=django.utils.timezone.now)

    objects = UserAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['adresse','identifiant', 'numero_telephone', 'nationalite','role']

    def __str__(self):
        return self.email

    @property
    def is_societe(self):
        return self.role == "societe"

    @property
    def is_employeur(self):
        return self.role == "employeur"

    @property
    def is_candidat(self):
        return self.role == "candidat"
    class Meta:
        verbose_name_plural = 'Utilisateur'


class Competence(models.Model):
    nom = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.nom

class Societe(models.Model):
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, primary_key=True, related_name="societe"
    )
    nom = models.CharField(max_length=100)
    description = models.TextField(max_length=200)
    slogan=models.TextField(max_length=30,null=True,blank=True)
    twitter=models.CharField(max_length=50,null=True,blank=True)
    instagram=models.CharField(max_length=50,null=True,blank=True)
    facebook=models.CharField(max_length=50,null=True,blank=True)
    linkedin=models.CharField(max_length=50,null=True,blank=True)
    pinterest=models.CharField(max_length=50,null=True,blank=True)
    website = models.CharField(max_length=100,null=True,blank=True)
    logo = models.ImageField(upload_to=upload_to, blank=True, null=True)
    secteur = models.CharField(max_length=100)
    best = models.BooleanField(default=False)

class Personne(models.Model):
    Genre_CHOICES = (
        ("homme", "homme"),
        ("femme", "femme"),
        ("autre", "autre"),
    )
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, primary_key=True, related_name="personne"
    )
    nom = models.CharField(max_length=50)
    titreduprofil=models.CharField(max_length=100,null=True)
    genre = models.CharField(max_length=20, choices=Genre_CHOICES, default='homme')
    prenom = models.CharField(max_length=50)
    date_naissance = models.DateField(null=True)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    competences = models.ManyToManyField(Competence, blank=True)
    cv=models.FileField(upload_to='cv/',blank=True,null=True)


class RatingCategory(Enum):
    COMMUNICATION = 'communication'
    PONCTUALITE = 'ponctualité'
    PROFESSIONNALISME = 'professionnalisme'
    CORRESPONDANCE_COMPETENCE= 'correspondance des compétences'
    QUALITE_DU_TRAVAIL='qualité du travail'
    COOPERATION='coopération'
    RESOLUTION_PROBLEME='résolution de problèmes'
    ADAPTABILITE='adaptabilité'
    SATISFACTION_GLOBALE='satisfaction globale'


class RatingCandidat(models.Model):
    STATUT_CHOICES = (
        ('vérifié', 'Vérifié'),
        ('pas vérifié', 'Pas Vérifié'),
    )
    candidat = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='candidat_ratings')
    societe = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='societe_ratings')
    ratecommunication = models.IntegerField(default=0,null=True)
    rateponctualite = models.IntegerField(default=0,null=True)
    rateprofessionnalisme = models.IntegerField(default=0,null=True)
    ratecorrespondancecompetence = models.IntegerField(default=0)
    ratequalitedutravail = models.IntegerField(default=0)
    ratecooperation = models.IntegerField(default=0)
    rateresolutionprobleme = models.IntegerField(default=0)
    rateadaptabilite = models.IntegerField(default=0)
    ratesatisfactionglobale = models.IntegerField(default=0)
    ratemoyenne=models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    review=models.TextField(max_length=100,null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='pas vérifié')

class RatingSociete(models.Model):
    STATUT_CHOICES = (
        ('vérifié', 'Vérifié'),
        ('pas vérifié', 'Pas Vérifié'),
    )
    candidat = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='rating_given_by_candidat')
    societe = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='rating_givento_societe')
    ratecommunication = models.IntegerField(default=0,null=True)
    rateenvironementdutravail = models.IntegerField(default=0,null=True)
    ratecroissanceprofessionnelle = models.IntegerField(default=0,null=True)
    rateremuneration = models.IntegerField(default=0)
    ratecomportementethique = models.IntegerField(default=0)
    rateculturediverse = models.IntegerField(default=0)
    ratesatisfactionglobale = models.IntegerField(default=0)
    ratemoyenne=models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    review=models.TextField(max_length=100,null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='pas vérifié')



    def __str__(self):
        return str(self.id)

