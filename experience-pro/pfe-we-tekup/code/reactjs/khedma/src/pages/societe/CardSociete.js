import React, { useState,useContext, useMemo,useEffect  } from 'react';
import '../personne/CardPersonne.css';
import { faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStarLight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getmoyenneratingparsociete } from '../../actions/auth';
import CryptoJS from 'crypto-js';
import RatingCondidat from '../personne/RatingCondidat';


function CardSociete({societe, nom, secteur,logo,role}) {
  const id=societe.user.id;
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchAverageRating();
  }, []);

  const fetchAverageRating = async () => {
    try {
      const response = await getmoyenneratingparsociete(id);
      setAverageRating(response.data.moyenneratingparsociete);
    } catch (error) {
      alert(error);
    }
  };

  const handleDetailClick = () => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
    const encodedId = encodeURIComponent(encryptedId);
    navigate(`/detail-societe/${encodedId}`);
  };
  

  const handleRatingClick = () => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'secretKey').toString();
    const encodedId = encodeURIComponent(encryptedId);
    navigate(`/ratingsociete/${encodedId}`);
  };
  return (
    <div className='body'>
      <section >
        <div className='container'>
          <div className='content'>
            <div className='cardPersonne'>
              <div className='card-content'>
                <div className='image'>
                  <img src={logo} alt="" />
                </div>
                <div className='name-profession'>
                  <span className='name'>{nom}</span>
                  <span className='profession'>{secteur}</span>
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
                  {role === 'candidat' ? (
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
  id: state.auth.user && state.auth.user.id,
  role: state.auth.user&& state.auth.user.role,
});

export default connect(mapStateToProps)(CardSociete);
