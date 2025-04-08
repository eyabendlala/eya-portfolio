from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Participation
from .models import Event, Secteur
from .serializers import EventSerializer, SecteurSerializer
from users.models import UserAccount
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from rest_framework.parsers import JSONParser



import logging
logger = logging.getLogger(__name__)

# @api_view(['GET'])
# def event_list(request):
#     """
#   List all events.
#     """

#     events = Event.objects.all()
#     serializer = EventSerializer(events, many=True)
#     # print("Events:", serializer.data)  

#     return Response(serializer.data)
# ...

@api_view(['GET'])
def event_list(request):
    """
    List all events, archive expired ones.
    """
    today = timezone.now().date() 
    
    # Archive les événements expirés au lieu de les supprimer
    expired_events = Event.objects.filter(date_expiration__lt=today, is_archived=False)
    expired_events.update(is_archived=True)  # Met à jour `is_archived` à `True` pour tous les événements filtrés

    # Récupération de la liste à jour des événements non expirés et non archivés
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    
    return Response(serializer.data)

@api_view(['POST'])
def event_create(request):
    
    # logger.info("Event creation process started.")
    
    try:
        # logger.debug("Extracting data from the request.")
        event_data = request.data

        # logger.debug("Accessing the uploaded image file.")
        image_file = request.FILES.get("image")  # Access the uploaded image file
    
        logger.debug("Accessing the user ID.")
        user_id = request.data.get('user_id')  
        logger.debug(f"User ID: {user_id}")

        user = get_object_or_404(UserAccount, pk=user_id)
        logger.debug(f"User found: {user}")

        logger.debug("Creating a new event instance.")
        
        new_event = Event.objects.create(
            title=event_data['title'],
            date=event_data['date'],
            location=event_data['location'],
            price=event_data['price'],
            description_event=event_data.get('description_event', ''),  # Add description_event field
            date_expiration=event_data.get('date_expiration', None),  # Add date_expiration field
            lien=event_data.get('lien', ''),  # Add lien field
            # secteur=event_data.get('secteur', ''),  
            image=image_file,            
            user=user
        )
        logger.debug(f"New event instance created: {new_event.id}")

        # Traitement des identifiants des secteurs
        secteur_ids = request.data.get('secteur_ids', [])  # Assurez-vous que les ID des secteurs viennent sous cette clé
        logger.debug(f"Secteur IDs received: {secteur_ids}")

        if secteur_ids:
            # Transformation des identifiants de chaînes en entiers si nécessaire; supprimez si déjà entiers
            secteur_ids = [int(id) for id in secteur_ids]
            
            # Trouvez les instances de secteur correspondantes et associez-les
            secteurs = Secteur.objects.filter(id__in=secteur_ids)
            new_event.secteur.set(secteurs)  # Utilisez `set` pour établir les relations ManyToMany
            
            # Log pour confirmer le nombre de secteurs associés
            logger.debug(f"Secteurs associated with the event: {new_event.secteur.all().count()}")


            
        serializer = EventSerializer(new_event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.exception("An error occurred during event creation.")
        return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def event_detail(request, pk):
    """
    Retrieve a single event.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = EventSerializer(event)
    return Response(serializer.data)

@api_view(['PUT'])
def event_update(request, pk):
    """
    Update a single event.
    """
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    event_data = request.data
    event.title = event_data.get('title', event.title)
    event.description_event = event_data.get('description_event', event.description_event)
    event.date = event_data.get('date', event.date)
    event.location = event_data.get('location', event.location)
    event.price = event_data.get('price', event.price)
    # event.image = event_data.get('image', event.image)
    event.date_expiration = event_data.get('date_expiration', event.date_expiration)
    event.lien=event_data.get('lien', '')
    # event.secteur = event_data.get('secteur', event.secteur)
    # event.save()
     

    if 'image' in request.FILES:
        event.image = request.FILES['image']

     # Ici, on traite la mise à jour des secteurs liés à l'événement.
    if 'secteur_ids' in event_data:
        secteur_ids = event_data['secteur_ids']
        # Transformation des identifiants de chaînes en entiers si nécessaire; supprimez si déjà entiers.
        secteur_ids = [int(id) for id in secteur_ids]
        # Trouver les instances de secteur correspondantes et les associer.
        secteurs = Secteur.objects.filter(id__in=secteur_ids)
        event.secteur.set(secteurs)
    else:
        # Si aucun secteur n'est sélectionné, dissociiez tous les secteurs de l'événement
        event.secteur.clear()
    
    event.save()
    return Response({'message': 'Event Updated'})



@api_view(['DELETE'])
def event_delete(request, event_id):
    """
    Delete a single event.
    """
    logger.info(f"Attempting to delete event with ID={event_id}")

    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        logger.error(f"Event with pk={event_id} does not exist")
        return Response(status=status.HTTP_404_NOT_FOUND)

    logger.info(f"Deleting event with pk={event_id}")
    event.delete()
    logger.info(f"Event with pk={event_id} deleted successfully")
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def confirm_participation(request):
    try:
        # Récupérer l'ID de l'événement à partir de la requête
        event_id = request.data.get('event_id')
        logger.debug(f"Event ID: {event_id}")

        # Récupérer l'événement
        event = Event.objects.get(pk=event_id)
      
        # Récupérer l'ID de l'utilisateur connecté à partir de la requête
        current_user_id = request.data.get('user_id')
        logger.debug(f"User ID: {current_user_id}")
        
        # Vérifier si l'utilisateur est authentifié
        if not current_user_id:
            raise ValueError("L'utilisateur n'est pas authentifié")

        # Vérifier si l'utilisateur a déjà participé à cet événement
        if Participation.objects.filter(user_id=current_user_id, event_id=event_id).exists():
            return JsonResponse({'success': False, 'message': 'Vous avez déjà participé à cet événement'})

        # Créer une nouvelle participation
        participation = Participation.objects.create(
            user_id=current_user_id,
            event_id=event_id
        )

        # Log pour suivre la confirmation de la participation
        logger.info(f"Utilisateur {current_user_id} a confirmé sa participation à l'événement {event.title}")

        return JsonResponse({'success': True, 'message': 'Participation confirmée avec succès'})
    except Event.DoesNotExist:
        # Log pour l'événement non trouvé
        logger.error(f"L'événement avec l'ID {event_id} n'existe pas")
        return JsonResponse({'success': False, 'message': 'L\'événement spécifié n\'existe pas'})
    except Exception as e:
        # Log pour d'autres erreurs
        logger.error(f"Erreur lors de la confirmation de la participation : {str(e)}")
        return JsonResponse({'success': False, 'message': 'Erreur lors de la confirmation de la participation'})
    

    
@api_view(['GET'])
def check_participation(request, event_id, user_id):
    try:
        # Log pour afficher les IDs de l'utilisateur et de l'événement sélectionnés
        print(f"Checking participation for User ID: {user_id} and Event ID: {event_id}")
        
        # Vérifiez si l'utilisateur a déjà participé à l'événement
        participated = Participation.objects.filter(event_id=event_id, user_id=user_id).exists()
        
        # Log pour vérifier si la participation a été vérifiée avec succès
        print(f"Participation check for Event ID {event_id} and User ID {user_id} successful")
        
        return JsonResponse({'participated': participated})
    except Exception as e:
        # Log pour les erreurs lors de la vérification de la participation
        print(f"Error checking participation: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    

@api_view(['DELETE'])
def cancel_participation(request, event_id, user_id):
    try:
        # Vérifier si la participation existe
        participation = Participation.objects.get(event_id=event_id, user_id=user_id)
        # Supprimer la participation
        participation.delete()
        return JsonResponse({'success': True, 'message': 'Participation annulée avec succès'})
    except Participation.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'La participation spécifiée n\'existe pas'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
    
       

@api_view(['PUT']) 
def PublieEvent(request,eid):
    events = Event.objects.get(pk = eid)
    events.is_active = not events.is_active
    events.save()
    msg = 'Event caché!'
    if (events.is_active):
        msg = 'Event Publié!'
    return Response({'message': msg}) 


@api_view(['PUT'])
def archiver_event(request, eid):
    try:
        event = Event.objects.get(pk=eid)
        event.is_archived = not event.is_archived  # Change l'état d'archivage
        event.save()
        return Response({'message': 'Événement mis à jour.'})
    except Event.DoesNotExist:
        return Response({'message': 'Événement introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    

# Crud Secteur 

@api_view(['POST'])
def create_secteur(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = SecteurSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def list_secteurs(request):
    if request.method == 'GET':
        secteurs = Secteur.objects.all()
        serializer = SecteurSerializer(secteurs, many=True)
        return Response(serializer.data)
    

    
@api_view(['PUT'])
def update_secteur(request, pk):
    try:
        secteur = Secteur.objects.get(pk=pk)
    except Secteur.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = SecteurSerializer(secteur, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def delete_secteur(request, pk):
    try:
        secteur = Secteur.objects.get(pk=pk)
    except Secteur.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        secteur.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)