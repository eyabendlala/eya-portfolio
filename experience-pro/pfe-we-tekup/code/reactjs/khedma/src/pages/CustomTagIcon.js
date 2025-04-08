import React from 'react';
import './CustomTagIcon.css';

const CustomTagIcon = ({ isClicked, onClick }) => {
  const strokeColor = "#808080";

  return (
    <svg onClick={onClick} className={`star-icon ${isClicked ? 'clicked' : ''}`}
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
         fill={isClicked ? "#FFD700" : "none"} 
         stroke={strokeColor} strokeWidth="1.5" 
         strokeLinecap="round" strokeLinejoin="round" 
         width="30" height="30">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
};


export default CustomTagIcon;