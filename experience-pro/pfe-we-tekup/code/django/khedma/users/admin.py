from django.contrib import admin
from .models import UserAccount
from .models import Personne

from .models import Societe, RatingCandidat,RatingSociete

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Personne)
admin.site.register(Societe)

@admin.register(RatingCandidat)
class RatingCandidat(admin.ModelAdmin):
    list_display=['id','candidat','societe','created_at','ratecommunication','rateponctualite','rateprofessionnalisme','ratecorrespondancecompetence','ratequalitedutravail',
    'ratecooperation','rateresolutionprobleme','rateadaptabilite','ratesatisfactionglobale','ratemoyenne']
    readonly_fields=['created_at']

