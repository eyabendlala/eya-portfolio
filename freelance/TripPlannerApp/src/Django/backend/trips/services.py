# trips/services.py
from datetime import timedelta
import requests

def geocode_address(address):
    """Convert an address into latitude and longitude using Nominatim API"""
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
    headers = {"User-Agent": "MyDjangoApp/1.0 (your-email@example.com)"}  # Replace with your email
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    
    return None  # Return None if the address could not be geocoded




def calculate_eld_logs(trip):
    rules = {
        "max_hours": 70,
        "max_days": 8,
        "fuel_interval": 1000,  # miles
        "pickup_dropoff_time": 1  # heure
    }

    # Calcul du temps de conduite
    driving_time = trip.distance / 50  # Supposons 50 mph
    required_rest = max(0, driving_time - 11)  # Règle fictive
    fuel_stops = trip.distance // rules["fuel_interval"]

    # Génération des journaux de bord
    logs = [
        {"type": "Driving", "duration": driving_time},
        {"type": "Rest", "duration": required_rest},
        {"type": "Fuel Stop", "count": fuel_stops},
    ]

    return {
        "total_driving_hours": driving_time,
        "required_rest": required_rest,
        "fuel_stops": fuel_stops,
        "logs": logs
    }