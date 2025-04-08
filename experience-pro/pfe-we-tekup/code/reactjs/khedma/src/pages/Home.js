import React, { useState, useEffect } from 'react';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import Slider from '../components/Slider';
import PostEmploi from './PostEmploi';
import SearchBar from './SearchBar';
import Navbar from '../components/Navbar';
import Notification from './Notification'; // Import the Notification component
import './PostEmploi.css';
import axios from 'axios';
import HomeBestOf from './HomeBestOf';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
//import NotifFireBase from '../notification/NotifFireBase'
 
// export const baseURL = 'http://127.0.0.1:8000';

function Home() {
  const [emplois, setEmplois] = useState([]);
  const [filteredEmplois, setFilteredEmplois] = useState([]);
  const [showNotification, setShowNotification] = useState(true); // Control whether to show the notification

  // Function to fetch emplois data
  const getEmplois = async () => {
    try {
      
      const response = await axios.get(`/get-emplois`);
      return response.data;
    } catch (error) {
      console.error("Error fetching emplois:", error);
      return [];
    }
  };

  // Apply filtering logic here
  const applyFiltering = (selectedType, selectedRegion) => {
    const filtered = emplois.filter(
      (item) =>
        item.type_emploi === selectedType &&
        item.region === selectedRegion
    );
    setFilteredEmplois(filtered);
  };

  // Function to delete an emploi
  const deleteItem = async (emploiId) => {
    try {
      const response = await axios.delete(`/delete-emploi/${emploiId}/`);
      if (response.status === 204) {
        //console.log("Emploi deleted successfully");
        // Refresh emplois by calling getEmplois again
        const updatedEmplois = await getEmplois();
        setEmplois(updatedEmplois);
        setFilteredEmplois(updatedEmplois); // Refresh filteredEmplois as well
      } else {
        console.error("Error deleting emploi:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting emploi:", error);
    }
  };
  const findLastActiveEmplois = (emplois, n) => {
    const activeEmplois = emplois.filter((item) => item.is_active);
    const lastActiveEmplois = activeEmplois.slice(-n);
    return lastActiveEmplois;
  };


  useEffect(() => {
    // Fetch emplois data
    getEmplois()
      .then((res) => {
        //console.log("res from API", res);
        setEmplois(res);
        setFilteredEmplois(res); // Initialize the filteredEmplois with all offers
      })
      .catch((error) => {
        console.error("Error fetching emplois:", error);
      });

    // Check if the notification has been dismissed by the user
    const notificationDismissed = localStorage.getItem('notificationDismissed');
    setShowNotification(!notificationDismissed);
  }, []);

  // Callback to dismiss the notification and save the state
  const dismissNotification = () => {
    localStorage.setItem('notificationDismissed', 'true');
    setShowNotification(false);
  };


 



  const slicedEmplois = filteredEmplois.slice(0, 5);
//console.log("slicedEmplois:", slicedEmplois);

return (
  <div className="App">
    <div className="app-container">
      {showNotification && <Notification dismissNotification={dismissNotification} />}
      <Slider applyFiltering={applyFiltering} />
      <div className="post-container">
        <div className="container">
          <span className="testspan" style={{ fontSize: '25px', color: 'white' }}>Emplois Récent:</span>
          <div className="row">
            {() =>{
              console.log("in home", findLastActiveEmplois(filteredEmplois, 4))
            }}
            {findLastActiveEmplois(filteredEmplois, 4).map((item) => (
              <PostEmploi
                image_emploi={item.image_emploi}
                titre={item.titre}
                localisation={item.localisation}
                user={item.user}
                type_emploi={item.type_emploi}
                onclick={() => deleteItem(item.idEmploi)}
                id_empl={item.idEmploi}
                description={item.description}
                date_postulation={item.date_postulation}
                date_expiration={item.date_expiration}
                duree_offre={item.duree_offre}
                genre_demande={item.genre_demande}
                intervalle_age={item.intervalle_age}
                montant_paiement={item.montant_paiement}
                experience={item.experience}
                
              />
            ))}
          </div>
          <Link to="/emplois">Cliquez ici pour plus d'offres d'emploi! ...</Link>
          <HomeBestOf />
        </div>
      </div>
    </div>

  </div>
);
}
export default Home;