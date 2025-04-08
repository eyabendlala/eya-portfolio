from .models import Emploi,Categorie,Application
from rest_framework import serializers
from .models import Favoris


class EmploiSerializers(serializers.ModelSerializer):
    class Meta:
        model=Emploi
        fields='__all__'

class CreerEmploiSerializer(serializers.ModelSerializer):
    class Meta:
        model=Emploi
        fields='__all__'

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Categorie
        fields='__all__'


class FavorisSerializer(serializers.ModelSerializer):
    # Ajoutez cette ligne pour incorporer le sérialiseur Emploi
    emploi = EmploiSerializers(read_only=True)  

    class Meta:
        model = Favoris
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    
    # Utilisez SerializerMethodField pour récupérer des informations à partir des relations
    full_name = serializers.SerializerMethodField()
    cv_link = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    adresse = serializers.SerializerMethodField()
    numero_telephone = serializers.SerializerMethodField()
    nationalite = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    date_naissance = serializers.SerializerMethodField()

    titre = serializers.CharField(source='emploi.titre')
    description = serializers.CharField(source='emploi.description', read_only=True)
    localisation = serializers.CharField(source='emploi.localisation', read_only=True)
    image_emploi = serializers.ImageField(source='emploi.image_emploi', read_only=True)
    
      # Nouveaux champs relatifs au recruteur
    recruteur_email = serializers.SerializerMethodField()
    recruteur_numero_telephone = serializers.SerializerMethodField()

    # Nouveau champ pour le nom du recruteur
    nom_recruteur = serializers.SerializerMethodField()

    class Meta:
        model = Application
        # fields = ['id', 'full_name', 'applied_on', 'status', 'cv_link']    
        fields = ['id', 'full_name', 'applied_on', 'status', 'cv_link', 'email', 'adresse', 'numero_telephone', 'nationalite', 'image', 'date_naissance', 'titre', 'description', 'localisation', 'image_emploi', 'recruteur_email', 'recruteur_numero_telephone', 'nom_recruteur']

    def get_full_name(self, obj):
        # On s'attend à ce que chaque candidature ait un utilisateur associé avec un profil Personne
        return "{} {}".format(obj.user.personne.nom, obj.user.personne.prenom)
    
    def get_cv_link(self, obj):
        if obj.user.personne.cv:
            # Assurez-vous de configurer correctement MEDIA_URL dans votre settings.py pour l'accès au fichier
            request = self.context.get('request')
            cv_path = obj.user.personne.cv.url
            return request.build_absolute_uri(cv_path) if request else cv_path
        return None
    
    def get_email(self, obj):
        return obj.user.email if obj.user else None

    def get_adresse(self, obj):
        return obj.user.adresse if obj.user else None

    def get_numero_telephone(self, obj):
        return obj.user.numero_telephone if obj.user else None

    def get_nationalite(self, obj):
        return obj.user.nationalite if obj.user else None
    
    def get_image(self, obj):
        if obj.user.personne.image:
            request = self.context.get('request')
            image_path = obj.user.personne.image.url
            return request.build_absolute_uri(image_path) if request else image_path
        return None
    
    def get_date_naissance(self, obj):
        return obj.user.personne.date_naissance if obj.user.personne.date_naissance else None
    
    # Méthodes pour extraire les informations du recruteur
    def get_recruteur_email(self, obj):
        return obj.emploi.user.email if obj.emploi and obj.emploi.user else None

    def get_recruteur_numero_telephone(self, obj):
        return obj.emploi.user.numero_telephone if obj.emploi and obj.emploi.user else None
    
    # Méthode pour obtenir le nom du recruteur en fonction du rôle
    def get_nom_recruteur(self, obj):
        recruteur = obj.emploi.user  # Récupère l'utilisateur qui a publié l'emploi
        if recruteur.is_societe:
            # Si le recruteur est une société, retourner le nom de la société
            return recruteur.societe.nom
        elif recruteur.is_employeur:
            # Si le recruteur est un employeur individuel, retourner nom et prénom
            return "{} {}".format(recruteur.personne.nom, recruteur.personne.prenom)
        return None