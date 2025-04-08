# 🚚 Trip Planner – Truck Driver Route & ELD Log Tool

## 🧭 Objective

Trip Planner is a web application designed for **truck drivers** and **fleet managers** to streamline trip planning, ensure ELD (Electronic Logging Device) compliance, and provide real-time routing assistance. The app takes key trip inputs and outputs detailed route maps and daily log sheets in accordance with federal Hours of Service (HOS) regulations.

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Django + Django REST Framework  
- **Database**: PostgreSQL  
- **Maps**: Free Maps API (e.g., Leaflet, OpenStreetMap, or Mapbox)  
- **Real-time Data**: WebSocket (optional for live updates)

---

## 🔍 Features

### 🚀 Inputs
- **Current Location**
- **Pickup Location**
- **Dropoff Location**
- **Current Cycle Hours Used**

### 📤 Outputs
- **Map View**:
  - Displays the planned route
  - Highlights required **stops** and **rest areas**
  - Integrates free map services for live visualization

- **ELD Daily Log Sheets**:
  - Auto-generated logs based on trip duration and breaks
  - Supports **multiple days** of logging
  - Visual rendering of log charts in compliance with HOS

---

## 🧠 Assumptions

- **Driver type**: Property-carrying
- **Cycle**: 70 hours/8 days
- **No adverse driving conditions** considered
- **Fuel stop**: Required every 1,000 miles
- **1-hour buffer** for both pickup and dropoff operations

---

## 📌 Future Improvements
- Integration with real-time traffic APIs
- Alert system for upcoming rest breaks
- Sync with trucker GPS devices
- Account system for saving past trips

---

## 🖼️ Interfaces

Cette section contient un aperçu visuel de l'application **Trip Planner**, incluant les vues principales utilisées par les conducteurs.

- [🏠 Accueil](./images/Acceuil.png) – Page d'accueil de l'application, point de départ de la planification du trajet.
- [🗺️ Carte + ELD Logs](./images/Map+ELD_Logs.png) – Visualisation de la route avec arrêts et logs journaliers automatiques.
- [💬 Forum](./images/forum.png) – Espace de discussion entre conducteurs pour échanger conseils, itinéraires et actualités.

> Cliquez sur chaque lien pour afficher les captures d'écran.


## 🧾 License

MIT License

---

## ✨ Author

[Eya Ben Dlala](https://github.com/eya-ben-dlala)

