from rest_framework import serializers
from .models import Abonnement, classique, Iapremium


class AbonnementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abonnement
        fields = ("id","typeAbon", "user", "payed")


class AbonnementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abonnement
        fields = ("typeAbon", "user", "payed")


class classiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = classique
        fields = ("id","key","Classictype","nb","prix")


class IapremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Iapremium
        fields = ("id","key","Classictype","prix")



