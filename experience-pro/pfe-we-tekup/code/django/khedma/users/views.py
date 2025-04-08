from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework import status
from .serializers import PersonneSerializer, SocieteSerializer, UserAccountSerializer
from .models import UserAccount, Societe, Personne
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.shortcuts import get_object_or_404
from .models import UserAccount
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from djoser.utils import decode_uid
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from .serializers import PersonneSerializer, SocieteSerializer, UserAccountSerializer, PersonnesResponseSerializer,SocieteResponseSerializer,RatingCandidatSerializer
from .models import UserAccount, Societe, Personne, RatingCandidat, RatingCategory,Competence, RatingSociete
from .serializers import CompetenceSerializer, RatingSocieteSerializer
from rest_framework import status
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.shortcuts import get_object_or_404
from .models import UserAccount
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from djoser.utils import decode_uid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Avg
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

class UserActivationView(APIView):
    def get(self, request, uid, token):
        # Convert uid back to an integer
        user_id = decode_uid(uid)
        user = get_object_or_404(UserAccount, pk=user_id)
        user.is_active = True
        user.save()
        return Response({'message': 'Account activated successfully.'})
#get users by id
class PersonneDetailView(APIView):
    def get(self, request, pk):
        personne = get_object_or_404(Personne, pk=pk)
        serializer = PersonneSerializer(personne)
        return Response(serializer.data)

class SocieteDetailView(APIView):
    def get(self, request, pk):
        societe = get_object_or_404(Societe, pk=pk)
        serializer = SocieteSerializer(societe)
        return Response(serializer.data)



#Admin views
class AdminView(APIView):
    #@login_required
    def get(self, request):
            users = UserAccount.objects.all()
            serializer = UserAccountSerializer(users, many=True)
            personnes = Personne.objects.all()
            personnes_serializer = PersonneSerializer(personnes, many=True)
            societes = Societe.objects.all()
            societes_serializer = SocieteSerializer(societes, many=True)
            return Response({'users':serializer.data, 'personnes':personnes_serializer.data, 'societes': societes_serializer.data})
    #@login_required
    def post(self, request):
        if request.data['role'] == 'societe':
            societe_serializer = SocieteSerializer(data=request.data)
            if societe_serializer.is_valid():
                user = UserAccount.objects.create_user(
                    email=request.data['email'],
                    password=request.data['password'],
                    role=request.data['role'],
                    adresse=request.data['adresse'],
                    numero_telephone=request.data['numero_telephone'],
                    nationalite=request.data['nationalite'],
                    identifiant = request.data['identifiant'],
                )

                societe_data = {
                    'user': user,
                    'nom': request.data['nom'],
                    'secteur': request.data['secteur'],
                    'description': request.data['description'],
                    'website': request.data['website'],
                    'slogan':request.data['slogan'],
                    'twitter':request.data['twitter'],
                    'instagram':request.data['instagram'],
                    'facebook':request.data['facebook'],
                    'linkedin':request.data['linkedin'],
                    'pinterest':request.data['pinterest'],
                }

                if UserAccount.objects.filter(id=user.id, societe__isnull=False).exists():
                    societe = Societe.objects.get(user=user)
                    serializer = SocieteSerializer(societe, data=societe_data)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'message': 'Societe creer'})
                else:
                    societe = Societe.objects.create(**societe_data)
                    return Response({'message': 'Societe creer'})
            else:
                print(societe_serializer.errors)
        else:
            personne_serializer = PersonneSerializer(data=request.data)
            if personne_serializer.is_valid():
                if request.data['role'] == 'admin':
                    user = UserAccount.objects.create_superuser(
                        email=request.data['email'],
                        password=request.data['password'],
                        role=request.data['role'],
                        adresse=request.data['adresse'],
                        numero_telephone=request.data['numero_telephone'],
                        nationalite=request.data['nationalite'],
                        identifiant = request.data['identifiant'],
                    )
                    personne_data = {
                        'user': user,
                        'nom': request.data['nom'],
                        'prenom': request.data['prenom'],
                        'date_naissance': request.data['date_naissance'],
                        'genre': request.data['genre'],
                    }
                    if UserAccount.objects.filter(id=user.id, personne__isnull=False).exists():
                        personne = Personne.objects.get(user=user)
                        serializer = PersonneSerializer(personne, data=personne_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        return Response({'message': 'Admin creer'})
                    else:
                        personne = Personne.objects.create(**personne_data)
                        return Response({'message': 'Admin creer'})
                else:
                    user = UserAccount.objects.create_user(
                        email=request.data['email'],
                        password=request.data['password'],
                        role=request.data['role'],
                        adresse=request.data['adresse'],
                        numero_telephone=request.data['numero_telephone'],
                        nationalite=request.data['nationalite'],
                        identifiant = request.data['identifiant'],
                    )
                    personne_data = {
                        'user': user,
                        'nom': request.data['nom'],
                        'prenom': request.data['prenom'],
                        'date_naissance': request.data['date_naissance'],
                        'genre': request.data['genre'],
                        'titreduprofil': request.data['titreduprofil']
                    }
                    if UserAccount.objects.filter(id=user.id, personne__isnull=False).exists():
                        personne = Personne.objects.get(user=user)
                        serializer = PersonneSerializer(personne, data=personne_data)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                        return Response({'message': 'User creer'})
                    else:
                        personne = Personne.objects.create(**personne_data)
                        return Response({'message': 'User creer'})
            else:
                print(personne_serializer.errors) 
                return Response({'message': 'Erreur'})
           
    #@login_required
    def delete(self, request):
        user = UserAccount.objects.get(email=request.data['email'])
        user.delete()
        return Response({'message': 'User deleted successfully!'})
    

class AdminDetailView(APIView):
    #@login_required
    def get(self, request, uid):
        try:
            user = UserAccount.objects.get(pk=uid)
            serializer = UserAccountSerializer(user)
            combined_data = {}
            if user.role == 'societe':
                societe = Societe.objects.get(user = uid)
                societe_serializer = SocieteSerializer(societe)
                societe_serializer = societe_serializer.data
                serializer = serializer.data
                combined_data = {**serializer, **societe_serializer}
                
            else:
                personne = Personne.objects.get(user = uid)
                personne_serializer = PersonneSerializer(personne)
                personne_serializer = personne_serializer.data
                serializer = serializer.data
                combined_data = {**serializer, **personne_serializer}
            #print(combined_data)
            return JsonResponse(combined_data)
        except UserAccount.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    #@login_required
    def put(self,request, uid):
        try:    
            user = UserAccount.objects.get(pk = uid)
        except UserAccount.DoesNotExist:
            return Response({'message':'User does not exist'})
        if not request.data:
            user.is_active = not user.is_active
            user.save()
            return Response({'message':'user activation changed'}) 
        else:
            #print('Hello update')
            user_update = {
                'email': request.data['email'],
                'adresse': request.data['adresse'],
                'identifiant': request.data['identifiant'],
                'numero_telephone': request.data['numero_telephone'],
                'nationalite': request.data['nationalite'],
            }
            serializer = UserAccountSerializer(user, data=user_update, partial=True)
            if serializer.is_valid():
                serializer.save()
                if user.role == 'societe':
                    societe = Societe.objects.get(user = uid)
                    societe_update = {
                        'nom': request.data['nom'],
                        'description': request.data['description'],
                        'website': request.data['website'],
                        'secteur': request.data['secteur'],
                        'slogan':request.data['slogan'],
                        'twitter':request.data['twitter'],
                        'instagram':request.data['instagram'],
                        'facebook':request.data['facebook'],
                        'linkedin':request.data['linkedin'],
                        'pinterest':request.data['pinterest'],
                    }
                    societe_serializer = SocieteSerializer(societe, data= societe_update, partial = True)
                    if societe_serializer.is_valid():
                        societe_serializer.save()
                        return Response({'message':'User updated'})
                    else: 
                        return Response(societe_serializer.errors, status=400)
                else: 
                    personne = Personne.objects.get(user = uid)
                    personne_update = {
                        'nom': request.data['nom'],
                        'prenom': request.data['prenom'],
                        'genre': request.data['genre'],
                        'date_naissance': request.data['date_naissance'],
                        'titreduprofil':request.data['titreduprofil']
                    }
                    personne_serializer = PersonneSerializer(personne, data=personne_update, partial=True)
                    if personne_serializer.is_valid():
                        personne_serializer.save()
                        return Response({'message':'User updated'})
                    else:
                        return Response(personne_serializer.errors, status=400)
            return Response(serializer.errors, status=400)

@api_view(['PUT']) 
def updateStatusSociete(request, sid):
    societe = Societe.objects.get(pk = sid)
    societe.best = not societe.best
    societe.save()
    msg = 'Societe changed status'
    return Response({'message': msg}) 

class AdminActivationUser(APIView):
    def put(self,request, uid):
        #print('Hello louay')
        user = UserAccount.objects.get(pk = uid)
        #print(user.is_active)
        user.is_active = not user.is_active
        #print(user.is_active)
        serializer = UserAccountSerializer(user, partial=True)
        serializer.save()
        return Response({'message':'user activation changed'})

        


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from .serializers import PersonneSerializer, SocieteSerializer, UserAccountSerializer, PersonnesResponseSerializer,SocieteResponseSerializer, RatingCandidatSerializer
from .models import UserAccount, Societe, Personne, RatingCandidat, RatingCategory,Competence
from .serializers import CompetenceSerializer
from rest_framework import status
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.shortcuts import get_object_or_404
from .models import UserAccount
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from djoser.utils import decode_uid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser

class PersonneCreateView(APIView):
    #récupérer la liste des personnes
    def get(self, request):
        personnes = Personne.objects.filter(user__role__in=['employeur', 'condidat'])
        serializer = PersonneSerializer(personnes, many=True)
        parser_classes = (MultiPartParser, FormParser)
        return Response(serializer.data)
    def post(self, request):
        serializer = PersonneSerializer(data=request.data)
        parser_classes = (MultiPartParser, FormParser)
        if serializer.is_valid():
            user = UserAccount.objects.create_user(
                email=request.data['email'],
                password=request.data['password'],
                role=request.data['role'],
                adresse=request.data['adresse'],
                numero_telephone=request.data['numero_telephone'],
                nationalite=request.data['nationalite'],
            )
            personne_data = {
                'user': user,
                'nom': request.data['nom'],
                'prenom': request.data['prenom'],
                'date_naissance': request.data['date_naissance'],
                'genre': request.data['genre'],
                'image': request.data['image'],
            }

            if UserAccount.objects.filter(id=user.id, personne__isnull=False).exists():
                personne = Personne.objects.get(user=user)
                serializer = PersonneSerializer(personne, data=personne_data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            else:
                personne = Personne.objects.create(**personne_data)

            # Send activation email
            current_site = get_current_site(request)
           
            token = default_token_generator.make_token(user)
            uid = encode_uid(str(user.pk))  # Convert user primary key to UID
            activation_url = f"http://{current_site}/activate/{uid}/{token}"

            # Build the activation URL
            #activation_url = f"{current_site}activate/{user.pk}/{token}"

            subject = 'Account Activation'
            message = f'Hi {user.email}, Please click the link below to activate your account:\n\n{activation_url}'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            send_mail(subject, message, from_email, recipient_list)

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class SocieteCreateView(APIView):
    #récupérer tous les sociétés
    def get(self, request):
        societes = Societe.objects.all()
        serializer = SocieteSerializer(societes, many=True)
        parser_classes = (MultiPartParser, FormParser)
        return Response(serializer.data)
    def post(self, request):
        serializer = SocieteSerializer(data=request.data)
        parser_classes = (MultiPartParser, FormParser)
        if serializer.is_valid():
            user = UserAccount.objects.create_user(
                email=request.data['email'],
                password=request.data['password'],
                role=request.data['role'],
                adresse=request.data['adresse'],
                numero_telephone=request.data['numero_telephone'],
                nationalite=request.data['nationalite'],
            )

            societe_data = {
                'user': user,
                'nom': request.data['nom'],
                'secteur': request.data['secteur'],
                'slogan':request.data['slogan'],
                'description': request.data['description'],
                'website': request.data['website'],
                'twitter':request.data['twitter'],
                'instagram':request.data['instagram'],
                'facebook':request.data['facebook'],
                'linkedin':request.data['linkedin'],
                'pinterest': request.data['pinterest'],
                'logo': request.data['logo'],

            }

            if UserAccount.objects.filter(id=user.id, societe__isnull=False).exists():
                societe = Societe.objects.get(user=user)
                serializer = SocieteSerializer(societe, data=societe_data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            else:
                societe = Societe.objects.create(**societe_data)

            # Send activation email
            current_site = get_current_site(request)
           
            token = default_token_generator.make_token(user)
            uid = encode_uid(str(user.pk))  # Convert user primary key to UID
            #activation_url = reverse('user-activation', kwargs={'uid': uid, 'token': token})
            activation_url = f"http://{current_site}/activate/{uid}/{token}"


            # Build the activation URL
            

            subject = 'Account Activation'
            message = f'Hi {user.email}, Please click the link below to activate your account:\n\n{activation_url}'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            send_mail(subject, message, from_email, recipient_list)

            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class UserActivationView(APIView):
    def get(self, request, uid, token):
        # Convert uid back to an integer
        user_id = decode_uid(uid)
        user = get_object_or_404(UserAccount, pk=user_id)
        user.is_active = True
        user.save()
        return Response({'message': 'Account activated successfully.'})
#get users by id
class PersonneDetailView(RetrieveAPIView):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer
    

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        personne_serializer = self.get_serializer(instance)
        user_serializer = UserAccountSerializer(instance.user)
        return Response({
            "personne": personne_serializer.data,
            "user": user_serializer.data
        })

class SocieteDetailView(RetrieveAPIView):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object() 
        societe_serializer = self.get_serializer(instance)
        user_serializer = UserAccountSerializer(instance.user)
        return Response({
            "societe": societe_serializer.data,
            "user": user_serializer.data
        })
class ModifierPersonneView(UpdateAPIView):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = 'pk'

    def perform_update(self, serializer):
        personne = serializer.instance
        user = personne.user

        # Update the fields of the associated 'Personne' instance
        personne.nom = self.request.data.get('nom', personne.nom)
        personne.titreduprofil = self.request.data.get('titredupprofil', personne.titreduprofil)
        personne.prenom = self.request.data.get('prenom', personne.prenom)
        personne.date_naissance = self.request.data.get('date_naissance', personne.date_naissance)
        personne.genre = self.request.data.get('genre', personne.genre)
        personne.image = self.request.data.get('image', personne.image)

        # If the role is 'candidat', then update 'competences' and 'cv' fields
        if user.role == 'candidat':
            personne.competences.set(self.request.data.getlist('competences', personne.competences.all()))
            personne.cv = self.request.data.get('cv', personne.cv)

        personne.save()

        # Update the fields of the associated 'UserAccount' instance
        user.email = self.request.data.get('email', user.email)
        user.numero_telephone = self.request.data.get('numero_telephone', user.numero_telephone)
        user.adresse = self.request.data.get('adresse', user.adresse)
        user.nationalite = self.request.data.get('nationalite', user.nationalite)

        user.save()

        # Save the changes made to the 'Personne' instance
        serializer.save()

class ModifierSocieteView(UpdateAPIView):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = 'pk'

    def perform_update(self, serializer):
        societe = serializer.instance
        user = societe.user

        # Update the fields of the associated 'Personne' instance
        societe.nom = self.request.data.get('nom', societe.nom)
        societe.description = self.request.data.get('description', societe.description)
        societe.website = self.request.data.get('website', societe.website)
        societe.secteur= self.request.data.get('secteur',societe.secteur)
        societe.slogan=self.request.data.get('slogan',societe.slogan)
        societe.twitter=self.request.data.get('twitter',societe.twitter)
        societe.instagram=self.request.data.get('instagram',societe.instagram)
        societe.facebook=self.request.data.get('facebook',societe.facebook)
        societe.linkedin=self.request.data.get('linkedin',societe.linkedin)
        societe.pinterest=self.request.data.get('pinterest',societe.pinterest)
        societe.logo=self.request.data.get('logo',societe.logo)

        societe.save()

        # Update the fields of the associated 'UserAccount' instance
        user.email = self.request.data.get('email', user.email)
        user.numero_telephone = self.request.data.get('numero_telephone', user.numero_telephone)
        user.adresse = self.request.data.get('adresse', user.adresse)
        user.nationalite = self.request.data.get('nationalite', user.nationalite)

        user.save()

        # Save the changes made to the 'Personne' instance
        serializer.save()

class getCandidatsView(APIView):
    def get(self, request):
        personnes = Personne.objects.filter(user__role='candidat').prefetch_related('user')
        serializer = PersonnesResponseSerializer(personnes, many=True)
        return Response(serializer.data)
class getSocietesView(APIView):
    def get(self,request):
        societes=Societe.objects.all()
        serializer= SocieteResponseSerializer(societes,many=True)
        return Response(serializer.data)
    
class EnregistrerCandidatRatingView(APIView):
    def post(self, request):
        try:
            candidat_id = request.data['candidat_id']
            candidat = UserAccount.objects.get(id=candidat_id, role='candidat')
            societe_id = request.data['societe_id']  # Assuming the logged-in user is a "societe"
            societe = UserAccount.objects.get(Q(role='societe') | Q(role='employeur'), id=societe_id)
            ratecommunication = int(request.data.get('ratecommunication', 0))
            rateponctualite = int(request.data.get('rateponctualite', 0))
            rateprofessionnalisme = int(request.data.get('rateprofessionnalisme', 0))
            ratecorrespondancecompetence = int(request.data.get('ratecorrespondancecompetence', 0))
            ratequalitedutravail = int(request.data.get('ratequalitedutravail', 0))
            ratecooperation = int(request.data.get('ratecooperation', 0))
            rateresolutionprobleme = int(request.data.get('rateresolutionprobleme', 0))
            rateadaptabilite = int(request.data.get('rateadaptabilite', 0))
            ratesatisfactionglobale = int(request.data.get('ratesatisfactionglobale', 0))
            review=request.data['review']
            ratemoyenne=(ratecommunication+rateponctualite+rateprofessionnalisme+ratecorrespondancecompetence+ratequalitedutravail+ratecooperation+rateresolutionprobleme+rateadaptabilite+ratesatisfactionglobale)/9

            if ratecommunication < 0 or ratecommunication > 5 or rateponctualite <0 or rateponctualite >5 or rateprofessionnalisme <0 or rateprofessionnalisme >5 or ratecorrespondancecompetence <0 or ratecorrespondancecompetence >5 or ratequalitedutravail <0 or ratequalitedutravail >5 :
                return Response({"error": "Rating value should be between 0 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            if ratecooperation <0 or ratecooperation > 5 or rateresolutionprobleme <0 or ratecooperation >5 or rateadaptabilite <0 or ratecooperation > 5 or ratesatisfactionglobale < 0 or ratesatisfactionglobale >5:
                return Response({"error": "Rating value should be between 0 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            # Create or update the rating
            rating, created = RatingCandidat.objects.update_or_create(candidat=candidat, societe=societe,review=review,ratecommunication=ratecommunication, rateponctualite=rateponctualite, rateprofessionnalisme=rateprofessionnalisme,
            ratecorrespondancecompetence=ratecorrespondancecompetence,ratequalitedutravail=ratequalitedutravail,
            ratecooperation=ratecooperation,rateresolutionprobleme=rateresolutionprobleme,
            rateadaptabilite=rateadaptabilite,ratesatisfactionglobale=ratesatisfactionglobale, ratemoyenne=ratemoyenne)

            serializer = RatingCandidatSerializer(rating)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except UserAccount.DoesNotExist:
            return Response({"error": "Candidat or Societe not found"}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({"error": "Invalid request data"}, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        try:
            # Récupérez tous les ratings sociétés
            ratings = RatingCandidat.objects.all()

            # Créez une liste pour stocker les données de chaque rating
            ratings_data = []

            for rating in ratings:
                try:
                    societe = Societe.objects.get(user_id=rating.societe_id)
                except Societe.DoesNotExist:
                    societe = Personne.objects.get(user_id=rating.societe_id)
                candidat = Personne.objects.get(user_id=rating.candidat_id)

                # Construisez un dictionnaire de données pour ce rating
                rating_data = {
                    "id":rating.id,
                    "societe_id": societe.user_id,
                    "societe_nom": societe.nom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "candidat_id": candidat.user_id,
                    "candidat_nom": candidat.nom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "candidat_prenom": candidat.prenom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "moyenne_rating": rating.ratemoyenne,
                    "statut": rating.statut,# Assurez-vous d'ajuster cela en fonction de votre modèle RatingSociete
                    "date":rating.created_at,
                }

                # Ajoutez les données de ce rating à la liste
                ratings_data.append(rating_data)

            return Response(ratings_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_rating_categories(request):
    categories = [(tag.name, tag.value) for tag in RatingCategory]
    return JsonResponse({'categories': categories})

class ModifierStatutRatingView(APIView):
    def put(self, request, rating_id):
        try:
            statut = request.data.get('statut')
            
            rating = RatingCandidat.objects.get(id=rating_id)
            rating.statut = statut
            rating.save()

            return Response({"message": f"Statut of rating {rating_id} has been updated to '{statut}'"}, status=status.HTTP_200_OK)

        except RatingCandidat.DoesNotExist:
            return Response({"error": "Rating not found"}, status=status.HTTP_404_NOT_FOUND)

class CompetenceCreateView(APIView):
    #récupérer la liste des personnes
    def get(self, request):
        competences = Competence.objects.all()
        serializer = CompetenceSerializer(competences, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = CompetenceSerializer(data=request.data)
        if serializer.is_valid():
            competence_name = request.data.get('nom')
            
            # Check if a competence with the same name already exists
            if Competence.objects.filter(nom=competence_name).exists():
                return Response(
                    {"error": "Competence with this name already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create the competence if it does not exist
            competence = Competence.objects.create(nom=competence_name)
            serializer = CompetenceSerializer(competence)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request):
        #print(request.data)
        competence = Competence.objects.get(pk=request.data['id'])
        competence.delete()
        return Response({'message': 'La compétence est supprimé avec succés!'})
    
    def put(self,request):
        data = request.data['data']
        competence = Competence.objects.get(pk = data['id'])
        competence.nom = data["nom"]
        competence.save()
        return Response({'message': 'La competence est modifé avec succés!'}) 
class CompetencesByPersonneView(APIView):
    def get(self, request, pk):
        try:
            personne = Personne.objects.get(pk=pk)
            competences = personne.competences.all()
            serializer = CompetenceSerializer(competences, many=True)
            return Response(serializer.data)
        except Personne.DoesNotExist:
            return Response({"error": "Personne not found."}, status=404)


@api_view(['POST'])
def add_competences_to_profile(request):
    try:
        user_id = request.data.get('user_id')
        personne = Personne.objects.get(user_id=user_id)
        selected_competence_ids = request.data.get('competences')  # List of competence IDs

        # Get the selected competences and associate them with the user's profile
        selected_competences = Competence.objects.filter(id__in=selected_competence_ids)
        personne.competences.add(*selected_competences)

        # Serialize the personne with updated competences and return the serialized data
        personne_serializer = PersonneSerializer(personne)
        return Response(personne_serializer.data, status=status.HTTP_200_OK)
    except Personne.DoesNotExist:
        return Response({"error": "Personne not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def delete_competence_from_profile(request):
    try:
        user_id = request.data.get('user_id')
        competence_id = request.data.get('competence_id')  # The ID of the competence to delete
        personne = Personne.objects.get(user_id=user_id)
        competence = Competence.objects.get(id=competence_id)

        # Remove the specified competence from the user's profile
        personne.competences.remove(competence)

        # Serialize the personne with updated competences and return the serialized data
        personne_serializer = PersonneSerializer(personne)
        return Response(personne_serializer.data, status=status.HTTP_200_OK)
    except Personne.DoesNotExist:
        return Response({"error": "Personne not found."}, status=status.HTTP_404_NOT_FOUND)
    except Competence.DoesNotExist:
        return Response({"error": "Competence not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_moyennerating_candidat(request, idcandidat):
    try:
        #moyenneratingparpersonne = RatingCandidat.objects.filter(candidat_id=idcandidat).aggregate(Avg('ratemoyenne'))['ratemoyenne__avg']
        moyenneratingparpersonne = RatingCandidat.objects.filter(candidat_id=idcandidat, statut='vérifié').aggregate(Avg('ratemoyenne'))['ratemoyenne__avg']
        
        if moyenneratingparpersonne is None:
            moyenneratingparpersonne = 0  # Set a default value if no ratings are found
        
        response_data = {
            'candidat_id': idcandidat,
            'moyenneratingparpersonne': round(moyenneratingparpersonne)
        }
        
        return JsonResponse(response_data)
    except RatingCandidat.DoesNotExist:
        return Response({"error": "Candidat not found."}, status=404)


class EnregistrerSocieteRatingView(APIView):
    def post(self, request):
        try:
            candidat_id = request.data['candidat_id']
            candidat = UserAccount.objects.get(id=candidat_id, role='candidat')
            societe_id = request.data['societe_id']  # Assuming the logged-in user is a "societe"
            societe = UserAccount.objects.get(id=societe_id, role='societe')
            ratecommunication = int(request.data.get('ratecommunication', 0))
            rateenvironementdutravail = int(request.data.get('rateenvironementdutravail', 0))
            ratecroissanceprofessionnelle = int(request.data.get('ratecroissanceprofessionnelle', 0))
            rateremuneration = int(request.data.get('rateremuneration', 0))
            ratecomportementethique = int(request.data.get('ratecomportementethique', 0))
            rateculturediverse = int(request.data.get('rateculturediverse', 0))
            ratesatisfactionglobale = int(request.data.get('ratesatisfactionglobale', 0))
            review=request.data['review']
            ratemoyenne=(ratecommunication+rateenvironementdutravail+ratecroissanceprofessionnelle+rateremuneration+ratecomportementethique+rateculturediverse+ratesatisfactionglobale)/7

            if ratecommunication < 0 or ratecommunication > 5 or rateenvironementdutravail <0 or rateenvironementdutravail >5 or ratecroissanceprofessionnelle <0 or ratecroissanceprofessionnelle >5 or rateremuneration <0 or rateremuneration >5 or ratecomportementethique <0 or ratecomportementethique >5 :
                return Response({"error": "Rating value should be between 0 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            if rateculturediverse <0 or rateculturediverse > 5 or ratesatisfactionglobale < 0 or ratesatisfactionglobale >5:
                return Response({"error": "Rating value should be between 0 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            # Create or update the rating
            rating, created = RatingSociete.objects.update_or_create(candidat=candidat, societe=societe,review=review,ratecommunication=ratecommunication, rateenvironementdutravail=rateenvironementdutravail,rateremuneration=rateremuneration,
            ratecomportementethique=ratecomportementethique,rateculturediverse=rateculturediverse,
            ratecroissanceprofessionnelle=ratecroissanceprofessionnelle,ratesatisfactionglobale=ratesatisfactionglobale, ratemoyenne=ratemoyenne)

            serializer = RatingSocieteSerializer(rating)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except UserAccount.DoesNotExist:
            return Response({"error": "Candidat or Societe not found"}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({"error": "Invalid request data"}, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        try:
            # Récupérez tous les ratings sociétés
            ratings = RatingSociete.objects.all()

            # Créez une liste pour stocker les données de chaque rating
            ratings_data = []

            for rating in ratings:
                # Récupérez la société et le candidat liés à ce rating
                societe = Societe.objects.get(user_id=rating.societe_id)
                candidat = Personne.objects.get(user_id=rating.candidat_id)

                # Construisez un dictionnaire de données pour ce rating
                rating_data = {
                    "id":rating.id,
                    "societe_id": societe.user_id,
                    "societe_nom": societe.nom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "candidat_id": candidat.user_id,
                    "candidat_nom": candidat.nom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "candidat_prenom": candidat.prenom,  # Assurez-vous d'ajuster cela en fonction de votre modèle UserAccount
                    "moyenne_rating": rating.ratemoyenne,
                    "statut": rating.statut,  # Assurez-vous d'ajuster cela en fonction de votre modèle RatingSociete4
                    "date":rating.created_at
                }

                # Ajoutez les données de ce rating à la liste
                ratings_data.append(rating_data)

            return Response(ratings_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_moyennerating_societe(request, idsociete):
    try:
        #moyenneratingparsociete= RatingSociete.objects.filter(societe_id=idsociete).aggregate(Avg('ratemoyenne'))['ratemoyenne__avg']
        moyenneratingparsociete = RatingSociete.objects.filter(societe_id=idsociete, statut='vérifié').aggregate(Avg('ratemoyenne'))['ratemoyenne__avg']
        
        if moyenneratingparsociete is None:
            moyenneratingparsociete = 0  # Set a default value if no ratings are found
        
        response_data = {
            'societe_id': idsociete,
            'moyenneratingparsociete': round(moyenneratingparsociete)
        }
        
        return JsonResponse(response_data)
    except RatingSociete.DoesNotExist:
        return Response({"error": "Societe not found."}, status=404)

class ModifierStatutSocieteRatingView(APIView):
    def put(self, request, rating_id):
        try:
            statut = request.data.get('statut')
            
            rating = RatingSociete.objects.get(id=rating_id)
            rating.statut = statut
            rating.save()

            return Response({"message": f"Statut of rating {rating_id} has been updated to '{statut}'"}, status=status.HTTP_200_OK)

        except RatingCandidat.DoesNotExist:
            return Response({"error": "Rating not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def change_password(request, user_id):
    if request.method == 'POST':
        new_password = request.data.get('new_password')
        old_password = request.data.get('old_password')

        try:
            user = UserAccount.objects.get(id=user_id)

            # Check if the old password matches the user's current password
            if not user.check_password(old_password):
                print("false")
                return Response({'error': 'Old password is incorrect'}, status=400)

            # Set the new password for the user
            user.set_password(new_password)
            user.save()

            return Response({'message': 'Password changed successfully'})
        except UserAccount.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
