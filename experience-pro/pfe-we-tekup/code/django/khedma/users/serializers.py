from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Personne, Societe,UserAccount, RatingCandidat, Competence, RatingSociete
from djoser.utils import encode_uid
from djoser.email import ActivationEmail
from rest_framework import serializers

User = get_user_model()



class CustomUserCreateSerializer(UserCreateSerializer):
    def create(self, validated_data):
        personne_data = validated_data.pop('personne', None)
        societe_data = validated_data.pop('societe', None)
        role = validated_data.get('role')

        user = super().create(validated_data)

        if role == 'employeur' or role == 'condidat':
            personne = Personne.objects.create(user=user, **personne_data) if personne_data else None
        elif role == 'societe':
            societe = Societe.objects.create(user=user, **societe_data) if societe_data else None

        # Send activation email
        uid = encode_uid(user.pk)
        activation_url = f"http://localhost:8000/auth/users/activate/{uid}"
        activation_email = ActivationEmail(self.context)
        activation_email.send(user=user, to=[user.email], context={'activation_url': activation_url})

        return user

    class Meta(UserCreateSerializer.Meta):
        model = User
class PersonneSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Personne
        fields = ('user_id','nom','titreduprofil', 'prenom', 'date_naissance', 'genre','image','competences','cv')

class SocieteSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False)
    class Meta:
        model = Societe
        fields = ('user_id','nom', 'description','slogan','twitter','instagram','facebook','linkedin','pinterest', 'website','secteur','logo','best')

class UserAccountSerializer(serializers.ModelSerializer):
    #image = serializers.ImageField(required=False)
    class Meta:
        model = UserAccount
        fields = ('id','email', 'adresse', 'identifiant', 'numero_telephone','role','nationalite','is_active','registration_date')

class PersonnesResponseSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer()

    class Meta:
        model = Personne
        fields = '__all__'

class RatingCandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model= RatingCandidat
        fields='__all__'

class RatingSocieteSerializer(serializers.ModelSerializer):
    class Meta:
        model=RatingSociete
        fields='__all__'
        

class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Competence
        fields='__all__'
class SocieteResponseSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer()

    class Meta:
        model = Societe
        fields = '__all__'

class CustomUserCreateSerializer(UserCreateSerializer):
    def create(self, validated_data):
        personne_data = validated_data.pop('personne', None)
        societe_data = validated_data.pop('societe', None)
        role = validated_data.get('role')

        user = super().create(validated_data)

        if role == 'employeur' or role == 'candidat':
            personne = Personne.objects.create(user=user, **personne_data) if personne_data else None
        elif role == 'societe':
            societe = Societe.objects.create(user=user, **societe_data) if societe_data else None

        # Send activation email
        uid = encode_uid(user.pk)
        activation_url = f"http://localhost:8000/auth/users/activate/{uid}"
        activation_email = ActivationEmail(self.context)
        activation_email.send(user=user, to=[user.email], context={'activation_url': activation_url})

        return user

    class Meta(UserCreateSerializer.Meta):
        model = User