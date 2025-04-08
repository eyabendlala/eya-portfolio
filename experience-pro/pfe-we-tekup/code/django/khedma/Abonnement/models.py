from django.db import models
from django.db import models
from users.models import Societe,UserAccount
import django.utils.timezone


class Abonnement(models.Model):
    Abonn_CHOICES = (
        ("classic", "Classic"),
        ("iapremium", "IAPremium"),
    )
    typeAbon = models.CharField(max_length=100, choices=Abonn_CHOICES)
    date_paiement = models.DateTimeField(default=django.utils.timezone.now)
    user = models.OneToOneField(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="abonnement",
        null=True,
        default=0,
    )
    payed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.typeAbon}   {self.user}"

    def save(self, *args, **kwargs):
        # Call the superclass's save method first
        super(Abonnement, self).save(*args, **kwargs)

        # Automatically create a classique instance when typeAbon is "classic"


class classique(models.Model):
    ClassictypeChoices = [
        ("basic", "Basic"),
        ("standard", "Standard"),
        ("premium", "Premium"),
    ]
    Classictype = models.CharField(
        max_length=100,
        choices=ClassictypeChoices,
    )

    key = models.OneToOneField(
        Abonnement,
        on_delete=models.CASCADE,
        null=True,
        limit_choices_to={"typeAbon": "classic"},
        default=0,
    )
    nb = models.IntegerField()
    prix = models.IntegerField(editable=False)

    def get_default_nb(cls, classictype):
        if classictype == "basic":
            return 5
        elif classictype == "standard":
            return 10
        elif classictype == "premium":
            return 20

    def get_default_prix(cls, classictype):
        if classictype == "basic":
            return 10
        elif classictype == "standard":
            return 16
        elif classictype == "premium":
            return 29

    def get_default_type(cls, classictype):
        if classictype in ["basic", "standard", "premium"]:
            return "classic"

    def save(self, *args, **kwargs):
        if self.pk is None:  # Check if it's a new instance being created
            self.typeAbon = self.get_default_type(self.Classictype)
            self.nb = self.get_default_nb(self.Classictype)
            self.prix = self.get_default_prix(self.Classictype)
        super(classique, self).save(*args, **kwargs)


class Iapremium(models.Model):
    key = models.OneToOneField(
        Abonnement,
        on_delete=models.CASCADE,
        null=True,
        limit_choices_to={"typeAbon": "iapremium"},
        default=0,
    )
    prix = models.IntegerField(default="120", editable=False)
    Classictype = models.CharField(
        max_length=100, null=True, editable=False, default="iapremium"
    )

    def get_default_type(cls, classictype):
        if classictype == "iapremium":
            return "iapremium"

    def get_default_prix(cls, classictype):
        if classictype == "iapremium":
            return 38

    def save(self, *args, **kwargs):
        if self.pk is None: 
            self.typeAbon = self.get_default_type(self.Classictype)
            self.prix = self.get_default_prix(self.Classictype)
        super(Iapremium, self).save(*args, **kwargs)

# class PaymentHistory(models.Model):
#     userr=models.ForeignKey(UserAccount, on_delete=models.CASCADE, blank=True, null=True)
#     product=models.ForeignKey(Abonnement, on_delete=models.SET_NULL, blank=True, null=True)
#     date=models.DateTimeField(auto_now_add=True)
#     payment_status=models.BooleanField()

#     def __str__(self):
#         return self.product.name
# Create your models here.


class PaymentHistory(models.Model):
     user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, blank=True, null=True)
     product = models.ForeignKey(Abonnement, on_delete=models.SET_NULL, blank=True, null=True)
     date = models.DateTimeField(auto_now_add=True)
     payment_status = models.BooleanField(default=False)  # Set the default value as needed

def __str__(self):
      return f"PaymentHistory for {self.user.email}"