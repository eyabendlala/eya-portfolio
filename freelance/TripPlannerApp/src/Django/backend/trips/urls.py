# trips/urls.py
from django.urls import path
from .views import TripAPIView

urlpatterns = [
    path('trips/', TripAPIView.as_view(), name='trip-list-create'),
]