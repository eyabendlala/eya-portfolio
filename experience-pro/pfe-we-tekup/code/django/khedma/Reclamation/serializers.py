from rest_framework import serializers
from .models import Reclamation
from users.models import UserAccount, Personne, Societe


class UserDetailsSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email')
    numero_telephone = serializers.CharField(source='user.numero_telephone')

    class Meta:
        model = Personne
        fields = ['nom', 'prenom', 'email', 'numero_telephone']


class SocieteDetailsSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email')
    numero_telephone = serializers.CharField(source='user.numero_telephone')


    class Meta:
        model = Societe
        fields = ['nom', 'email', 'numero_telephone']


class ReclamationSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()

    class Meta:
        model = Reclamation
        fields = '__all__'

    def get_user_details(self, obj):
        if obj.user.role == 'societe':
            return SocieteDetailsSerializer(obj.user.societe).data
        elif obj.user.role == 'employeur':
            return UserDetailsSerializer(obj.user.personne).data
        elif obj.user.role == 'candidat':
            return UserDetailsSerializer(obj.user.personne).data
        return None
