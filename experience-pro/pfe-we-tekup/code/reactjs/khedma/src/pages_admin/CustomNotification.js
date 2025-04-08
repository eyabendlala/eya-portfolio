import React from 'react';

function CustomNotification({ titre, imageUrl }) {
  return (
    <div>
      <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#3498db' }}>
        {titre}
      </p>
      <p>Un nouveau emploi a été publié! Consultez les dernières offres d'emploi dès maintenant.</p>
      <img src={imageUrl} alt="Job Image" width="100" height="100" />
    </div>
  );
}

export default CustomNotification;
