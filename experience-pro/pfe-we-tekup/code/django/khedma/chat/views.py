from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Chat
from .models import Message 
from users.models import UserAccount
from .serializers import ChatSerializer

from rest_framework import generics
from .serializers import MessageSerializer
from django.views.decorators.csrf import ensure_csrf_cookie


class AddMessageView(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class GetMessagesView(APIView):
    def get(self, request, chat_id):
        messages = Message.objects.filter(chat_id=chat_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=200)

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    
class UserChats(APIView):
    def get(self, request, user_id):
        chats = Chat.objects.filter(members__contains=[user_id])
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        return Response(status=status.HTTP_400_BAD_REQUEST)

class CreateChatView(APIView):
    def post(self, request):
        # Extract members from request data
        members = request.data.get("members", [])

        # Check if there are exactly two unique members
        if len(members) != 2 or len(set(members)) != 2:
            return Response({"detail": "Members list should contain exactly two unique members."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a chat with these members already exists
        chat_exists = Chat.objects.filter(members=members).exists()

        if chat_exists:
            return Response({"detail": "A chat with these members already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ChatSerializer(data=request.data)
        
        if serializer.is_valid():
            chat = serializer.save()
            return Response(ChatSerializer(chat).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_chats(request, user_id):
    if request.method == 'GET':
        chats = Chat.objects.filter(members__contains=[user_id])
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)


class getUserChat(APIView):
    #récupérer la liste des personnes
    
        chats = Chat.objects.all()
        serializer = ChatSerializer(chats, many=True)
    




class FindChat(APIView):
    def get(self, request, first_id, second_id):  # Make sure parameter names match
        try:
            chat = Chat.objects.get(members=[first_id, second_id])
            return Response(ChatSerializer(chat).data, status=status.HTTP_200_OK)
        except Chat.DoesNotExist:
            return Response({'error': 'Chat not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def find_chat(request, first_id, second_id):
    if request.method == 'GET':
        try:
            chat = Chat.objects.get(members=[first_id, second_id])
            return Response(ChatSerializer(chat).data, status=status.HTTP_200_OK)
        except Chat.DoesNotExist:
            return Response({'error': 'Chat not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_400_BAD_REQUEST)
