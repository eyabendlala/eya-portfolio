from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Reclamation
from .serializers import ReclamationSerializer
from users.models import UserAccount

import logging
logger = logging.getLogger(__name__)

@api_view(['GET'])
def reclamation_list(request):
    """
    List all claims for the connected recruiter.
    """
    recruteur_id = request.query_params.get('recruteur')
    if recruteur_id is not None:
        claims = Reclamation.objects.filter(user_id=recruteur_id)
        serializer = ReclamationSerializer(claims, many=True)
        return Response(serializer.data)
    else:
        return Response({"error": "Le paramètre 'recruteur' est manquant dans la requête."}, status=400)


@api_view(['GET'])
def reclamation_list_admin(request):
    """
  List all claims.
    """

    claims = Reclamation.objects.all()
    serializer = ReclamationSerializer(claims, many=True)
    # print("Reclamations:", serializer.data)  

    return Response(serializer.data)

@api_view(['POST'])
def reclamation_create(request):
    try:
        logger.info("Received request to create reclamation")
        reclamation_data = request.data
        logger.info(f"Request data: {reclamation_data}")

        user_id = reclamation_data.get('user_id')
        if not user_id:
            logger.error("User ID not provided in request")
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Fetching user with ID: {user_id}")
        user = get_object_or_404(UserAccount, pk=user_id)

        logger.info("Creating new reclamation")
        new_reclamation = Reclamation.objects.create(
            subject=reclamation_data['subject'],
            description=reclamation_data['description'],
            status=reclamation_data.get('status', 'open'),
            user=user
        )

        logger.info("New reclamation created successfully")
        serializer = ReclamationSerializer(new_reclamation)
        logger.info(f"Serialized data: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def reclamation_detail(request, pk):
    try:
        reclamation = Reclamation.objects.get(pk=pk)
    except Reclamation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ReclamationSerializer(reclamation)
    return Response(serializer.data)

@api_view(['PUT'])
def reclamation_update(request, pk):
    try:
        reclamation = Reclamation.objects.get(pk=pk)
    except Reclamation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    reclamation_data = request.data
    reclamation.subject = reclamation_data.get('subject', reclamation.subject)
    reclamation.description = reclamation_data.get('description', reclamation.description)
    reclamation.status = reclamation_data.get('status', reclamation.status)

    reclamation.save()
    serializer = ReclamationSerializer(reclamation)
    return Response(serializer.data)

@api_view(['DELETE'])
def reclamation_delete(request, pk):
    try:
        reclamation = Reclamation.objects.get(pk=pk)
    except Reclamation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    reclamation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
