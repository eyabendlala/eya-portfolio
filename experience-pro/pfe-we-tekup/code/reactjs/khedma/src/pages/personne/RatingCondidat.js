import React, { useState, useEffect } from 'react';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { Navigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import { getPersonneParId, ratingcandidat } from '../../actions/auth';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import './RatingCondidat.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RatingCondidat = ({societe,ratingcandidat,isAuthenticated,role,personne}) => {
  //console.log("is authenticated",isAuthenticated);
  const [nom,setNom]=useState('');
  const [prenom,setPrenom]=useState('');
  const [ratecommunication,setRatecommunication]=useState('');
  const [rateponctualite,setRateponctualite]=useState('');
  const [rateprofessionnalisme,setRateprofessionnalisme]=useState('');
  const [ratecorrespondancecompetence,setRatecorrespondancecompetence]=useState('');
  const [ratequalitedutravail,setRatequalitedutravail]=useState('');
  const [ratecooperation,setRatecooperation]=useState('');
  const [rateresolutionprobleme,setRateresolutionprobleme]=useState('');
  const [rateadaptabilite,setRateadaptabilite]=useState('');
  const [ratesatisfactionglobale,setRatesatisfactionglobale]=useState('');
  const [review, setReview] = useState('');
  const societeId= societe && societe.user && societe.user.id; 
  const employeurId= personne && personne.user && personne.user.id; 
  const { id } = useParams();
  //console.log("id from useParams:", id);
  const decodedId = decodeURIComponent(id);
  //console.log("decoded id is:", decodedId);
  const decryptedId = CryptoJS.AES.decrypt(decodedId, 'secretKey').toString(CryptoJS.enc.Utf8);
  //console.log("decrypted id is:",decryptedId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log('candidat id', id);
        const response = await getPersonneParId(decryptedId);
        const data = response.data;
        //console.log(data.personne);

        // Check if data.personne exists before setting the states
        if (data.personne) {
          setNom(data.personne.nom);
          setPrenom(data.personne.prenom);
        }
      } catch (error) {
        alert(error);
      }
    };

    // Load user data only if id is available
    if (decryptedId) {
      fetchData();
    }
  }, [decryptedId]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append('candidat_id',decryptedId);
      formData.append('societe_id',societeId || employeurId);
      formData.append('ratecommunication',ratecommunication || 0);
      formData.append('rateponctualite',rateponctualite || 0);
      formData.append('rateprofessionnalisme',rateprofessionnalisme || 0);
      formData.append('ratecorrespondancecompetence',ratecorrespondancecompetence || 0);
      formData.append('ratequalitedutravail',ratequalitedutravail || 0);
      formData.append('ratecooperation',ratecooperation || 0);
      formData.append('rateresolutionprobleme',rateresolutionprobleme || 0);
      formData.append('rateadaptabilite',rateadaptabilite || 0);
      formData.append('ratesatisfactionglobale',ratesatisfactionglobale || 0);
      formData.append('review',review);
      const response = await ratingcandidat(formData);

    if (response) {
      toast.success('🦄 Votre numerotation pour ce candidat est enregistré  avec succés!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
  };

  if(!isAuthenticated){
    return <Navigate to="/login" />;
  }
  if(role =="candidat"){
    return <Navigate to="/notfoundpage" />;
  }

  return (
    <div>
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Khedma.site</h1>
                <div className="custom-breadcrumbs">
                  <span className="text-white"><strong>Trouvez le candidat idéal parmi notre réseau dynamique.</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className='bodyrating'>
      <div className='boxrating text-center'>
        <form onSubmit={onSubmit}>
        <h3>Donner une notation au candidat {nom} {prenom}</h3>
        <br/>
      <div className='row text-center'>
        <label>Communication: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatecommunication(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratecommunication ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Ponctualité: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateponctualite(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateponctualite ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Professionnalisme: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateprofessionnalisme(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateprofessionnalisme ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Correspondance des compétences: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatecorrespondancecompetence(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratecorrespondancecompetence ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Qualité du travail: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatequalitedutravail(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratequalitedutravail ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Coopération: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatecooperation(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratecooperation ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Résolution de problèmes: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateresolutionprobleme(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateresolutionprobleme ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Adaptabilité: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateadaptabilite(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateadaptabilite ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Satisfaction globale: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatesatisfactionglobale(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratesatisfactionglobale ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <textarea
        rows="4"
        cols="50"
        placeholder="Donner votre avis ici..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className='row'>
        <input type="submit" value="Enregistrer notation"/>
      </div>


      </form>

      </div>
    </div>


    </div>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  societe: state.auth.user && state.auth.user.societe,
  personne: state.auth.user && state.auth.user.personne,
  role: state.auth.user&& state.auth.user.role,
});

export default connect(mapStateToProps,{ ratingcandidat })(RatingCondidat);
