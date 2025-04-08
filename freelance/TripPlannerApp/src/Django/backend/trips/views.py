# trips/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer
from .services import calculate_eld_logs, geocode_address

class TripAPIView(generics.CreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Crée le Trip et calcule les logs ELD
        trip = serializer.save()

        # Géocodage direct sans sauvegarde dans le modèle
        current_coords = geocode_address(trip.current_location)
        pickup_coords = geocode_address(trip.pickup_location)
        dropoff_coords = geocode_address(trip.dropoff_location)

        coords = {
            "current": current_coords,
            "pickup": pickup_coords,
            "dropoff": dropoff_coords,
        }
        eld_data = calculate_eld_logs(trip)
        
        # Construit la réponse personnalisée
        response_data = {
            "trip": serializer.data,
            "coords": coords,
            "eld_logs": eld_data
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
