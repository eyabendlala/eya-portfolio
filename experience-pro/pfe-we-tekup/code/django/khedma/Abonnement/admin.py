from django.contrib import admin
from .models import Abonnement, classique, Iapremium

admin.site.register(Abonnement)
admin.site.register(Iapremium)
admin.site.register(classique)
# Register your models here.