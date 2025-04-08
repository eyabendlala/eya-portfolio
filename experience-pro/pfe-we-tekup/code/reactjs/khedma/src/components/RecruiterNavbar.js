import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './RecruiterNavbar.css'; 
import Chat from '../pages/chat/Chat';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTimes  } from '@fortawesome/free-solid-svg-icons';

const RecruiterNavbar = () => {
   
const [isChatOpen, setIsChatOpen] = useState(false);

const handleOpenChat = () => {
  setIsChatOpen(true);
};

const handleCloseChat = () => {
  setIsChatOpen(false); 
};
  // Utiliser useEffect pour ajouter/enlever la classe no-scroll
  useEffect(() => {
    if (isChatOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isChatOpen]);
  return (
    
    <div className="recruiter-navbar">
     

     <NavLink to="/recruteur/analyse" activeClassName="active">Tableau de Bord</NavLink> 
      <NavLink to="/recruteur/dashboard" activeClassName="active">Mes Offres</NavLink>
      {/* <NavLink to="/Chat" activeClassName="active">Communication </NavLink> */}
     <div onClick={handleOpenChat} className="communication-link">
        Communication
      </div>

      <NavLink to="/recruteur/gestion-event/list" activeClassName="active">Gestion Evénement</NavLink> 
      <NavLink to="/recruteur/reclamation" activeClassName="active">Réclamation</NavLink>

          {/* Affichage du composant Chat si isChatOpen est true */}
      {isChatOpen && (
        <div className="chat-overlay">
          <div className="chat-container">
            <button onClick={handleCloseChat} className="close-buttonnn">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <Chat /> 
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterNavbar;