from django.shortcuts import render
from .models import Emploi, Categorie, Favoris, Application
from users.models import UserAccount, Personne, Societe
from Abonnement.models import *
from rest_framework import viewsets
from .serializers import EmploiSerializers, CreerEmploiSerializer, CategoriesSerializer, FavorisSerializer, ApplicationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import routers
from django.conf.urls import include 
from django.urls import path
# Create a router
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from datetime import date
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.shortcuts import get_list_or_404





class EmploisViewset(APIView):
    #@login_required
    def get(self, request):
        today = date.today()
        #delete expired emplois
        expired_emplois = Emploi.objects.filter(date_expiration__lt=today)
        expired_emplois.delete()

        queryset = Emploi.objects.all().order_by('is_archived').order_by('is_active')
        serializer = EmploiSerializers(queryset, many=True)
        return Response(serializer.data)
   
@api_view(['PUT']) 
def ArchiveEmploi(request, eid):
    emplois = Emploi.objects.get(pk = eid)
    emplois.is_archived = not emplois.is_archived
    emplois.save()
    msg = 'Emplois non archivé!'
    if (emplois.is_archived):
        msg = 'Emplois Archivé!'
    return Response({'message': msg}) 

@api_view(['PUT']) 
def PublieEmploi(request,eid):
    emplois = Emploi.objects.get(pk = eid)
    emplois.is_active = not emplois.is_active
    emplois.save()
    msg = 'Emplois caché!'
    if (emplois.is_active):
        msg = 'Emplois Publié!'
    return Response({'message': msg}) 

@api_view(['POST'])
def PublierEmploiView(request):
    if request.method == 'POST':
        emploi_data = request.data
        image_file = request.FILES.get("image_emploi")  # Access the uploaded image file
        user_id= request.data['user_id']
        user = UserAccount.objects.get(id=user_id)
        new_emploi = Emploi.objects.create(
            titre=emploi_data['titre'],
            description=emploi_data['description'],
            date_postulation=emploi_data['date_postulation'],
            date_expiration=emploi_data['date_expiration'],
            duree_offre=emploi_data['duree_offre'],
            genre_demande=emploi_data['genre_demande'],
            intervalle_age=emploi_data['intervalle_age'],
            localisation=emploi_data['localisation'],
            montant_paiement=emploi_data['montant_paiement'],
            experience=emploi_data['experience'],
            region=emploi_data['region'],
            type_emploi=emploi_data['type_emploi'],
            user=user,
            image_emploi=image_file,  
        )
        new_emploi.categories.set(emploi_data['categories']) 

        categories = []
        for c in emploi_data['categories']:
            category = Categorie.objects.get(pk = c)
            categories.append(category.nom)
        nom = ''
        if user.role == 'societe':
            nom = Societe.objects.get(pk = user.id).nom
        else:
            personne = Personne.objects.get(pk = user.id)
            nom = personne.nom + ' ' + personne.prenom
        
        image_url = f"{settings.MEDIA_ROOT}/images/favicon.ico"
        subject = "Une nouvelle offre d'emploi soumise: " + new_emploi.titre
        message = render_to_string(
            'emploi_notification.html',
            {'emploi': new_emploi, 'categories': ', '.join(categories), 'employeur': nom, 'email': user.email, 'image': image_url}
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        admins = UserAccount.objects.filter(role='admin')
        recipient_list.extend([admin.email for admin in admins])

        try:
            send_mail(subject, message, from_email, recipient_list, html_message=message)
        except Exception as e:
            print(f"Email sending failed: {e}")

        # Serialize new emploi instance
        serializer = EmploiSerializers(new_emploi)  

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def GetEmplois(request, eid):
    emploi = Emploi.objects.get(pk = eid)
    serializer = EmploiSerializers(emploi)
    return Response(serializer.data)

@api_view(['PUT'])
def PutEmplois(request, eid):
    emploi = Emploi.objects.get(pk = eid)
    emploi_data = request.data
    print(emploi_data)
    emploi.titre= emploi_data['titre']
    emploi.description= emploi_data['description']
    emploi.date_postulation= emploi_data['date_postulation']
    emploi.date_expiration= emploi_data['date_expiration']
    emploi.duree_offre= emploi_data['duree_offre']
    emploi.genre_demande= emploi_data['genre_demande']
    emploi.intervalle_age= emploi_data['intervalle_age']
    emploi.localisation= emploi_data['localisation']
    emploi.montant_paiement= emploi_data['montant_paiement']
    emploi.experience= emploi_data['experience']
    emploi.region= emploi_data['region']
    emploi.type_emploi= emploi_data['type_emploi']
    user = UserAccount.objects.get(pk = emploi_data['user_id'])
    if (user):
        emploi.user = user
    emploi.save()
    return Response({'message': 'Emploi Modifié'})  
    #image_emploi=image_file,  # Save the image file using the ImageField


class getCategoriesView(APIView):
    def get(self, request):
        categories = Categorie.objects.all()
        serializer = CategoriesSerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['DELETE'])
def delete_emploi(request, emploi_id):
    try:
        emploi = Emploi.objects.get(pk=emploi_id)
    except Emploi.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        emploi.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        parent = request.data.get('parent')
        if parent is not None:
            parent = Categorie.objects.get(pk = request.data['parent'])
        slug = request.data.get('slug')
        description = request.data.get('description')
        category = Categorie.objects.create(
            nom= request.data["nom"],
            slug= slug,
            description = description,
            parent = parent
            )
        return Response({'message': 'Catégorie créer'})
    
    def delete(self,request):
        print(request.data)
        category = Categorie.objects.get(pk=request.data['id'])
        category.delete()
        return Response({'message': 'Catégorie supprimé avec succés!'})
    
    def put(self,request):
        data = request.data['data']
        category = Categorie.objects.get(pk = data['id'])
        category.nom = data["nom"]
        category.slug = data["slug"]
        category.description = data['description']
        parent = data.get('parent')
        if parent is not None:
            parent = Categorie.objects.get(pk = data['parent']) 
        category.parent = parent
        category.save()
        return Response({'message': 'Catégorie Modifier avec succéss!'})





import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
def toggle_favoris(request):
    logger.info("Toggle favoris method called")

    # Vérifie si l'utilisateur a déjà ajouté cet emploi à ses favoris
    user_id = request.data.get('user_id')  

    user = get_object_or_404(UserAccount, pk=user_id)


    emploi_id = request.data.get('emploi_id')  
    emploi = get_object_or_404(Emploi, pk=emploi_id)

    favoris_existant = Favoris.objects.filter(user=user, emploi=emploi).exists()
    

    # Si l'emploi est déjà dans les favoris de l'utilisateur, le supprime, sinon l'ajoute
    if favoris_existant:
        favoris = Favoris.objects.get(user=user, emploi=emploi)
        favoris.delete()
        favoris_existant = False  # L'emploi n'est plus favori


    else:
        favoris = Favoris.objects.create(user=user, emploi=emploi)
        favoris_existant = True   # L'emploi est maintenant favori

        
    # Sérialiser l'objet Favoris créé ou supprimé
    favoris_serializer = FavorisSerializer(instance=favoris)
    # logger.debug(f"Favoris serializer: {favoris_serializer.data}")


    # Redirige l'utilisateur vers la page où il se trouvait avant d'ajouter ou de supprimer l'emploi des favoris
    #return redirect(request.META.get('HTTP_REFERER', 'accueil'))
    return Response({"status": "success", "message": "Favoris toggled successfully", "isFavori": favoris_existant})



@api_view(['GET'])
def check_favoris(request):
    user_id = request.query_params.get('user_id')
    emploi_id = request.query_params.get('emploi_id')
    # logger.info(f"Vérification des favoris démarrée pour l'utilisateur avec ID: {user_id} et l'emploi avec ID: {emploi_id}")

    if user_id and emploi_id:
        user = get_object_or_404(UserAccount, id=user_id)
        emploi = get_object_or_404(Emploi, idEmploi=emploi_id)  # Utiliser le bon nom de champ
        # logger.debug(f"Utilisateur avec ID: {user.id} trouvé | Emploi avec ID: {emploi.idEmploi} trouvé")  # Corrigé pour utiliser idEmploi

        is_favori = Favoris.objects.filter(user=user, emploi=emploi).exists()
        return Response({"isFavori": is_favori})
    else:
        logger.warning("Paramètres user_id ou emploi_id manquants dans la requête")
        return Response({"error": "Missing parameters user_id or emploi_id"}, status=400)
    


@api_view(['GET'])
def get_user_favorites(request):
    try:
        user_id = request.query_params.get('user_id') 
        # logger.debug(f"User ID: {user_id}")

        user = get_object_or_404(UserAccount, pk=user_id)
        # logger.debug(f"User found: {user}")
        favorites = Favoris.objects.filter(user_id=user_id).select_related('emploi')
        serializer = FavorisSerializer(favorites, many=True)
        
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des favoris pour l'utilisateur ID {user_id}: {e}")
        return Response({"error": "Un problème est survenu lors de la récupération des favoris"}, status=400)
    

@api_view(['DELETE'])
def supprimer_favoris(request, emploi_id, user_id):
       
        try:
            favori = Favoris.objects.get(emploi_id=emploi_id, user_id=user_id )
            favori.delete()
            # Réponse de succès
            return JsonResponse({'status': 'success', 'message': 'Emploi supprimé des favoris.'})
        except Favoris.DoesNotExist:
            # Réponse si le favori n'est pas trouvé
            return JsonResponse({'status': 'error', 'message': 'Favori non trouvé.'}, status=404)
        


@api_view(['POST'])
def apply_to_job(request):
    logger.debug("Starting job application process")

    # Obtenir les données de la requête
    current_user_id = request.data.get('user_id')
    emploi_id = request.data.get('emploi_id')

    try:
        # Retrouver l'utilisateur et l'emploi
        user = get_object_or_404(UserAccount, pk=current_user_id)
        emploi = get_object_or_404(Emploi, pk=emploi_id)

        # Vérifier si une application existe déjà
        if Application.objects.filter(user=user, emploi=emploi).exists():
            logger.warning(f"User {current_user_id} has already applied for job {emploi_id}")
            return JsonResponse({'success': False, 'message': 'You have already applied for this job'}, status=400)

        # Créer une nouvelle application
        application = Application.objects.create(user=user, emploi=emploi)

        # Sérialiser et retourner la réponse
        serializer = ApplicationSerializer(application)
        # logger.debug(f"Application serialization successful for Application ID: {application.id}")
        return JsonResponse({'success': True, 'data': serializer.data, 'message': 'Application submitted successfully'}, status=201)

    except Emploi.DoesNotExist:
        logger.error(f"Emploi with ID: {emploi_id} does not exist")
        return JsonResponse({'success': False, 'message': 'The specified job does not exist'}, status=404)

    except UserAccount.DoesNotExist:
        logger.error(f"UserAccount with ID: {current_user_id} does not exist")
        return JsonResponse({'success': False, 'message': 'The specified user does not exist'}, status=404)

    except Exception as e:
        logger.exception("Unhandled exception occurred during job application", exc_info=True)
        return JsonResponse({'success': False, 'message': 'Error applying for the job'}, status=500)
    

@api_view(['GET'])
def has_user_applied(request, user_id, emploi_id):
    # Assumez que l'authentification et les permissions sont déjà gérées 
    print(f"Checking participation for User ID: {user_id} and Event ID: {emploi_id}")

    has_applied = Application.objects.filter(user_id=user_id, emploi_id=emploi_id).exists()
    return JsonResponse({'has_applied': has_applied})

# Ezspace Recruteur
class EmploisParRecruteurView(APIView):
    def get(self, request):
        recruteur_id = request.query_params.get('recruteur')
        if recruteur_id is not None:
            emplois = Emploi.objects.filter(user__id=recruteur_id)  # Assurez-vous que 'user__id' est le bon chemin pour accéder à l'ID du recruteur dans votre modèle Emploi. 
            serializer = EmploiSerializers(emplois, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)
        

@api_view(['GET'])
def count_applications_for_job(request, emploi_id):
    try:
        application_count = Application.objects.filter(emploi_id=emploi_id).count()
        return Response({'application_count': application_count})
    except Emploi.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_applications_for_job(request, emploi_id):
    applications = get_list_or_404(Application.objects.select_related('user', 'user__personne'), emploi_id=emploi_id)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)  # You can set the logging level as needed

@api_view(['GET'])
def get_application_details(request, application_id):
    logger.info(f"Received request to get details for application ID: {application_id}")
    try:
        # La jointure select_related est utilisée pour optimiser les requêtes SQL en préchargeant les objets relatifs
        application = Application.objects.select_related('user', 'user__personne').get(id=application_id)
        serializer = ApplicationSerializer(application, context={'request': request})
        logger.info(f"Successfully retrieved application details for ID: {application_id}")
        return Response(serializer.data)
    except Application.DoesNotExist:
        logger.error(f"Application with ID: {application_id} does not exist")
        return Response({'error': 'Candidature non trouvée.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"An error occurred while retrieving application details for ID: {application_id} - {str(e)}")
        return Response({'error': 'Une erreur est survenue.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Evaluation Candidature
from django.core.mail import send_mail
from django.core.mail import BadHeaderError
from django.http import HttpResponseBadRequest
from django.utils.html import strip_tags

def send_application_status_email(candidate_email, status_text, job_title, nom_recruteur):
    if status_text.lower() == 'accepted':
        subject = "Félicitations ! Votre candidature a été acceptée 🎉"
        html_message = f"""
        <html>
        <body>
        <p>Bonjour,</p>
        
        <p><strong style="color: green;">Félicitations !</strong> Votre candidature pour le poste <strong>{job_title}</strong> chez <strong>{nom_recruteur}</strong> a été acceptée 🎉 !</p>

        <p>Nous sommes impatients de vous accueillir au sein de notre équipe. Veuillez rester à l'écoute pour plus d'instructions 📋 et les détails relatifs à l'intégration 🚀.</p>

        <p>Cordialement,</p>
        <p style="font-weight: bold; color: #333;">L'équipe de recrutement </p>
        <p><strong style="font-weight: bold; color: #007bff;">{nom_recruteur}</strong></p>
        </body>
        </html>
        """
    elif status_text.lower() == 'refused':
        subject = "Mise à jour de votre statut de candidature"
        html_message = f"""
        <html>
        <body>
        <p>Bonjour,</p>

        <p>Nous regrettons de vous informer que votre candidature pour le poste <strong>{job_title}</strong> chez <strong>{nom_recruteur}</strong> n'a pas été retenue <span style="color: red;">❌</span>.</p>

        <p>Nous vous encourageons à postuler à nos futures offres correspondant à votre profil <span style="color: blue;">🔍</span>. Merci pour votre intérêt envers notre entreprise <span style="color: blue;">🙏</span>.</p>

        <p>Cordialement,</p>
        <p style="font-weight: bold; color: #333;">L'équipe de recrutement </p>
        <p><strong style="font-weight: bold; color: #007bff;">{nom_recruteur}</strong></p>
        </body>
        </html>
        """
    else:
        subject = "Mise à jour de votre statut de candidature"
        html_message = f"""
        <html>
        <body>
        <p>Bonjour,</p>

        <p>Nous regrettons de vous informer que votre candidature pour le poste <strong>{job_title}</strong> chez <strong>{nom_recruteur}</strong>  n'a pas été retenue <span style="color: red;">❌</span>.</p>

        <p>Nous vous encourageons à postuler à nos futures offres correspondant à votre profil <span style="color: blue;">🔍</span>. Merci pour votre intérêt envers notre entreprise <span style="color: blue;">🙏</span>.</p>

        <p>Cordialement,</p>
        <p style="font-weight: bold; color: #333;">L'équipe de recrutement </p>
        <p><strong style="font-weight: bold; color: #007bff;">{nom_recruteur}</strong></p>

        </body>
        </html>
        """

    try:
        send_mail(
            subject,
            strip_tags(html_message),  # Convert HTML to plain text for email clients that don't support HTML
            'khedmasite8@gmail.com',  # Replace with your sender email
            [candidate_email],
            html_message=html_message,
            fail_silently=False,
        )
    except BadHeaderError:
        return HttpResponseBadRequest('Invalid header found.')
    except Exception as e:
        return HttpResponseBadRequest(f'An error occurred: {str(e)}')

    
@api_view(['PATCH'])
def update_application_status(request, application_id):
    try:
        application = Application.objects.get(id=application_id)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if 'status' in data:
        application.status = data['status']
        application.save()

        # Send email notification
        candidate_email = application.user.email
        job_title = application.emploi.titre  # Utilisation correcte de l'attribut `emploi`
        # Récupération du nom du recruteur (societe ou employeur)
        recruteur = application.emploi.user
        if recruteur.is_societe:
            nom_recruteur = recruteur.societe.nom
        elif recruteur.is_employeur:
            nom_recruteur = f"{recruteur.personne.nom} {recruteur.personne.prenom}"
        else:
            nom_recruteur = "L'équipe de recrutement"
        if candidate_email:
            send_application_status_email(candidate_email, application.status, job_title, nom_recruteur)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    




@api_view(['GET'])
def get_all_applications(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Récupérez les emplois créés par le recruteur spécifié
        emplois = Emploi.objects.filter(user__id=recruteur_id)

        # Récupérez les candidatures pour ces emplois
        applications = Application.objects.filter(emploi__in=emplois).select_related('user', 'user__personne', 'emploi')

        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    else:
        return Response({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)




@api_view(['GET'])
def get_candidat_applications(request):
    logger.info("get_candidat_applications called")
    candidat_id = request.query_params.get('candidat')
    if candidat_id is not None:
        logger.info(f"Received candidat_id: {candidat_id}")
        try:
            applications = Application.objects.filter(user__id=candidat_id)
            serializer = ApplicationSerializer(applications, many=True)
            logger.info("Applications serialized successfully")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            logger.error("Invalid candidat ID format.")
            return Response({"error": "Invalid candidat ID format."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error("Le paramètre 'candidat' est manquant dans la requête.")
        return Response({"error": "Le paramètre 'candidat' est manquant dans la requête."}, status=status.HTTP_400_BAD_REQUEST)


# KPI Recruteur
from django.utils.timezone import now
from django.db.models import Count

@api_view(['GET'])
def applications_over_time(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        today = now()
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les candidatures pour ces emplois
        data = Application.objects \
            .filter(emploi__in=emplois) \
            .extra(select={'day': 'date(applied_on)'}) \
            .values('day') \
            .annotate(applications=Count('id')) \
            .order_by('day')
        return JsonResponse(list(data), safe=False)
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)
    

@api_view(['GET'])
def applications_over_time_admin(request):
    today = now()
    # Filtrer les candidatures et regrouper par date
    data = Application.objects \
        .extra(select={'day': 'date(applied_on)'}) \
        .values('day') \
        .annotate(applications=Count('id')) \
        .order_by('day')
    
    return JsonResponse(list(data), safe=False)

@api_view(['GET'])
def applications_by_status(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les candidatures pour ces emplois
        data = Application.objects.filter(emploi__in=emplois).values('status').annotate(count=Count('id'))
        return JsonResponse(list(data), safe=False)
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)

@api_view(['GET'])
def applications_by_job_title(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les candidatures pour ces emplois
        data = Application.objects.filter(emploi__in=emplois).values('emploi__titre').annotate(count=Count('id')).order_by('emploi__titre')
        return JsonResponse(list(data), safe=False)
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)


@api_view(['GET'])
def offer_acceptance_rate(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les candidatures pour ces emplois
        total_offers = Application.objects.filter(emploi__in=emplois).count()
        accepted_offers = Application.objects.filter(emploi__in=emplois, status='accepted').count()

        if total_offers > 0:
            acceptance_rate = (accepted_offers / total_offers) * 100
        else:
            acceptance_rate = 0

        return JsonResponse({'acceptance_rate': acceptance_rate})
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)


@api_view(['GET'])
def offer_acceptance_rate_admin(request):
    # Calculer le nombre total d'offres et d'offres acceptées globalement
    total_offers = Application.objects.count()
    accepted_offers = Application.objects.filter(status='accepted').count()

    if total_offers > 0:
        acceptance_rate = (accepted_offers / total_offers) * 100
    else:
        acceptance_rate = 0

    return JsonResponse({'acceptance_rate': acceptance_rate})

@api_view(['GET'])
def favorites_per_job(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les favoris pour ces emplois
        data = Favoris.objects \
            .filter(emploi__in=emplois) \
            .values('emploi__titre') \
            .annotate(count=Count('id')) \
            .order_by('emploi__titre')

        return JsonResponse(list(data), safe=False)
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)
import datetime

@api_view(['GET'])
def summary_metrics(request):
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        # Filtrer les emplois par recruteur
        emplois = Emploi.objects.filter(user__id=recruteur_id)
        # Filtrer les candidatures pour ces emplois
        applications = Application.objects.filter(emploi__in=emplois)
        
        total_candidates = applications.count()
        in_progress_candidates = applications.filter(status='in_progress').count()
        accepted_candidates = applications.filter(status='accepted').count()
        rejected_candidates = applications.filter(status='rejected').count()
        total_job_listings = emplois.count()
        expired_job_listings = emplois.filter(date_expiration__lt=datetime.date.today()).count()
        favorites_count = Favoris.objects.filter(emploi__in=emplois).count()
        offer_acceptance_rate = (accepted_candidates / total_candidates) * 100 if total_candidates > 0 else 0

        data = {
            'total_candidates': total_candidates,
            'in_progress_candidates': in_progress_candidates,
            'accepted_candidates': accepted_candidates,
            'rejected_candidates': rejected_candidates,
            'total_job_listings': total_job_listings,
            'expired_job_listings': expired_job_listings,
            'favorites_count': favorites_count,
            'offer_acceptance_rate': offer_acceptance_rate,
        }
        
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)
    

@api_view(['GET'])
def get_all_applications_admin(request):
    applications = Application.objects.select_related('user', 'user__personne').all()
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


# views.py

from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Configurez un logger pour ce module
logger = logging.getLogger(__name__)

@api_view(['POST'])
def send_email(request):
    logger.debug('Début de la fonction send_email')
    
    to_email = request.data.get('to')
    subject = request.data.get('subject')
    message = request.data.get('message')
    
    logger.debug(f'To: {to_email}, Subject: {subject}, Message: {message[:50]}')  # Log des premiers 50 caractères du message pour éviter les logs excessifs

    if not (to_email and subject and message):
        logger.warning('Champs requis manquants: %s, %s, %s', to_email, subject, message)
        return Response({'error': 'Tous les champs sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        logger.info('Tentative d\'envoi de l\'email')
        send_mail(subject, message, 'khedmasite8@gmail.com', [to_email])
        logger.info('Email envoyé avec succès')
        return Response({'message': 'Email envoyé avec succès!'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error('Erreur lors de l\'envoi de l\'email: %s', str(e), exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
