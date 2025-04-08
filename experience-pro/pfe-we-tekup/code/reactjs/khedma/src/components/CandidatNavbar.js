import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './RecruiterNavbar.css'; 

const CandidatNavbar = () => {
   

  return (
    
    <div className="recruiter-navbar" >
     
      <NavLink to="/favoris" activeClassName="active">Mes Favoris</NavLink>
      <NavLink to="/mes-candidatures" activeClassName="active">Mes candidatures</NavLink>


    </div>
  );
};

export default CandidatNavbar;