from .models import Event, Secteur
from rest_framework import serializers



class SecteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Secteur
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)
    # secteur = SecteurSerializer(many=True, read_only=True) 
    secteurs_noms = serializers.SerializerMethodField()
 

    class Meta:
        model = Event
        fields = '__all__'

    def get_secteurs_noms(self, obj):
    # Assurez-vous que cette ligne utilise le nom correct de la relation tel que défini dans votre modèle Event
        return [secteur.nom for secteur in obj.secteur.all()]
