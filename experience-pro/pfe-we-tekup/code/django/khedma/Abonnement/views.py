from django.shortcuts import render, redirect
from rest_framework import generics, status
from .serializers import (
    AbonnementSerializer,
    IapremiumSerializer,
    classiqueSerializer,
    AbonnementCreateSerializer,
)
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Abonnement, classique, Iapremium
from users.models import UserAccount
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .models import classique, Iapremium
# from django.http import JsonResponse
# class AbonnementView(viewsets.ModelViewSet):
# queryset = Abonnement.objects.all()
# serializer_class = AbonnementSerializer
import json
from users.models import UserAccount, Societe, Personne


@api_view(["GET"])
def apiOverview(request):
    api_urls = {
        "List": "/List/",
        "Detail_view": "/detail/<str:pk>/",
        "create": "/createA/",
    }
    return Response(api_urls)


@api_view(["GET"])
def list(request):
    abonnements = Abonnement.objects.select_related('user').all()
    abonnements_data = []

    for abonnement in abonnements:
        if abonnement.typeAbon == 'classic':
            nom = None 
            user_id = None
            if abonnement.user.role == 'societe':
                societe = Societe.objects.get(user_id=abonnement.user.id)
                nom = societe.nom
                user_id = societe.user_id
            else: 
                personne = Personne.objects.get(user_id=abonnement.user.id)
                nom = personne.nom + ' ' + personne.prenom
                user_id = personne.user_id
                
            try:
                typeAbon = classique.objects.get(key=abonnement.id)
                abonnements_data.append({
                        'id': abonnement.id,
                        'user_id' : user_id if abonnement.user else None,
                        'typeAbon': abonnement.typeAbon,
                        'date_paiement': abonnement.date_paiement,
                        'nom': nom if abonnement.user else None,
                        'categorie': typeAbon.Classictype,
                        'prix': typeAbon.prix,
                        'tentative': typeAbon.nb,
                        'payed': abonnement.payed
                        }
                    )
            except classique.DoesNotExist:
                typeAbon = None

    return JsonResponse({'abonnements': abonnements_data}, safe=False)


class AbonnementDetailView(APIView):
    def post(self,request,format=None):
        try:
            user = request.data.get("user")
            abonnement = Abonnement.objects.get(user=user)
            if abonnement.typeAbon=="classic":
                abon_C=classique.objects.get(key=abonnement)
                return Response({
                    'classictype': abon_C.Classictype,  
                    'typeAbon': abonnement.typeAbon  
                })
            elif abonnement.typeAbon=="iapremium":
                return Response({
                'typeAbon': abonnement.typeAbon
                })
        except Abonnement.DoesNotExist:
             return Response(
                {"it doesn't exist "}, status=status.HTTP_400_BAD_REQUEST
            )



@api_view(["POST"])
def Create(request):
    serializer = AbonnementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(["PUT"])
def stripePaiement(request, aid):
    print('Hello', aid)
    try:
        abonnement = Abonnement.objects.get(id=aid)
    except:
        return Response({'message': 'Veuillez acceder au demarche de paiement pour creer un abonnement!'})
    
    if abonnement.payed != True:
        abonnement.payed = True
        abonnement.save()
        return Response({'message': 'Paiement validé!'})
    else:
        return Response({'message' : 'Vous avez deja payé votre abonnement, merci!'})


class AbonnementCreateView(APIView):
    def post(self, request, format=None):
        try:
            typeAbon = request.data.get("typeAbon")
            user = request.data.get("user")
            user = json.loads(user)
            if user['role'] == 'societe' or user['role'] == 'employeur': 
                user_id = UserAccount.objects.get(id=user['id'])

            Classictype = request.data.get("Classictype")  # Keep this for compatibility
            if typeAbon is None:
                return Response(
                    {"error": "Invalid request data. 'typeAbon' required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif user is None:
                return Response(
                    {"error": "Invalid request data. 'user' required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            abonnement = Abonnement(typeAbon=typeAbon, user=user_id)
            abonnement.save()
            if typeAbon == "classic":
                if (
                    Classictype == "basic"
                    or Classictype == "standard"
                    or Classictype == "premium"
                ):
                    abonn_classic = classique(key=abonnement, Classictype=Classictype)
                    abonn_classic.save()
            elif typeAbon == "iapremium":
                abonn_iapremium = Iapremium(key=abonnement)
                abonn_iapremium.save()
            return Response(
                AbonnementSerializer(abonnement).data, status=status.HTTP_201_CREATED
            )
        except UserAccount.DoesNotExist:
            return Response(
                {"Error: Invalid request data "}, status=status.HTTP_400_BAD_REQUEST
            )


class check_abonnement(APIView):
    def post(self, request, format=None):
        user = request.data.get("user")
        user = json.loads(user)
        abonnements = Abonnement.objects.filter(user=user['id'])
        if abonnements.exists():
            # Abonnement exists
            abonnement = abonnements.first()  # Get the first matching abonnement
            return JsonResponse(
                {"message": "Abonnement  exists"}, status=status.HTTP_200_OK
            )
        else:
            # Abonnement does not exist
            return JsonResponse(
                {"message": "Abonnement not exists"}, status=status.HTTP_404_NOT_FOUND
            )
        
from django.http import JsonResponse

@api_view(["GET"])
def abonementbyuser(request, user_id):
    abonnement = get_object_or_404(Abonnement, user_id=user_id, typeAbon='classic')

    nom = None
    if abonnement.user.role == 'societe':
        societe = Societe.objects.get(user_id=abonnement.user.id)
        nom = societe.nom
    else: 
        personne = Personne.objects.get(user_id=abonnement.user.id)
        nom = personne.nom + ' ' + personne.prenom

    try:
        typeAbon = classique.objects.get(key=abonnement.id)
        abonnement_data = {
            'id': abonnement.id,
            'typeAbon': abonnement.typeAbon,
            'date_paiement': abonnement.date_paiement,
            'nom': nom if abonnement.user else None,
            'categorie': typeAbon.Classictype,
            'prix': typeAbon.prix,
            'tentative': typeAbon.nb
        }
    except classique.DoesNotExist:
        abonnement_data = None

    return JsonResponse({'abonnement': abonnement_data}, safe=False)