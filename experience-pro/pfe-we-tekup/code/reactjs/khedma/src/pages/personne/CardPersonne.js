import React, { useState,useContext, useMemo,useEffect  } from 'react';
import './CardPersonne.css';
import { faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStarLight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getmoyenneratingparcandidat } from '../../actions/auth';
import CryptoJS from 'crypto-js';
import RatingCondidat from './RatingCondidat';


function CardPersonne({candidat, nom, prenom, titreduprofil,image,role}) {
  //const encryptedId = useMemo(() => CryptoJS.AES.encrypt(candidat.user.id.toString(), 'SECRET_KEY').toString(), [candidat.user.id]);
  const id=candidat.user_id;
  //const encryptedId = CryptoJS.AES.encrypt(candidat.user.id.toString(), 'SECRET_KEY').toString();
  // console.log("test id candidat",id);
  //const decrypted=CryptoJS.AES.decrypt(encryptedId, 'SECRET_KEY').toString(CryptoJS.enc.Utf8);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  //const { setSelectedUserId } = useContext(SelectedUserIdContext); // Use useContext here

  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(null); // State to hold the average rating

  useEffect(() => {
    fetchAverageRating();
  }, []);

  const fetchAverageRating = async () => {
    try {
      const response = await getmoyenneratingparcandidat(id);
      setAverageRating(response.data.moyenneratingparpersonne);
    } catch (error) {
      alert(error);
    }
  };

  const handleDetailClick = () => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
    const encodedId = encodeURIComponent(encryptedId);
    navigate(`/detail-candidat/${encodedId}`);
  };
  

  const handleRatingClick = () => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
    const encodedId = encodeURIComponent(encryptedId);
    navigate(`/ratingcandidat/${encodedId}`);
  };
  return (
    <div className='card-employee'>
      <section >
        <div className='container'>
          <div className='content'>
            <div className='cardPersonne'>
              <div className='card-content'>
                <div className='image'>
                  <img src={image} alt="" />
                </div>
                <div className='name-profession'>
                  <span className='name'>{ prenom && prenom} {nom && nom}</span>
                  <span className='profession'>{titreduprofil && titreduprofil}</span>
                </div>
                <div className='rating'>
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={index}
                      className={`etoile ${index < Math.round(averageRating) ? 'filled' : 'empty'}`}
                    >
                      {index < Math.round(averageRating) ? (
                        <FontAwesomeIcon
                          icon={solidStar}
                          style={{ color: 'yellow' }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={regularStarLight}
                          className='fa-light'
                          style={{ color: 'yellow' }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className='button'>
                  <button onClick={handleDetailClick} className='aboutMe'>Détail </button> &nbsp; &nbsp; &nbsp;
                  {role === 'societe' || role === 'employeur' ? (
                    <button onClick={handleRatingClick} className='aboutMe'>
                      Noter
                    </button>
                  ) : null}
                </div>
              </div>
              </div>
            </div>
  
        </div>
      </section>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  id: state.auth.user && state.auth.user.id, // Add this line to get the id
  role: state.auth.user&& state.auth.user.role,
});

export default connect(mapStateToProps)(CardPersonne);
