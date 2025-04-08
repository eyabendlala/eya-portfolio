import React, { useState, useEffect } from 'react';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { Navigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import CryptoJS from 'crypto-js';
import { getSocieteParId, ratingsociete } from '../../actions/auth';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import '../personne/RatingCondidat.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const RatingSociete = ({societe,ratingsociete,isAuthenticated,personne,role}) => {
  const [nom,setNom]=useState('');
  const [ratecommunication,setRatecommunication]=useState('');
  const [rateenvironementdutravail,setRateenvironementdutravail]=useState('');
  const [ratecroissanceprofessionnelle,setRatecroissanceprofessionnelle]=useState('');
  const [rateremuneration,setRateremuneration]=useState('');
  const [ratecomportementethique,setRatecomportementethique]=useState('');
  const [rateculturediverse,setRateculturediverse]=useState('');
  const [ratesatisfactionglobale,setRatesatisfactionglobale]=useState('');
  const [review, setReview] = useState('');
  const candidatId= personne && personne.user && personne.user.id;
  //console.log("candidatId is:",candidatId)
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
        const response = await getSocieteParId(decryptedId);
        const data = response.data;
        //console.log(data.personne);

        // Check if data.personne exists before setting the states
        if (data.societe) {
          setNom(data.societe.nom);
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
      formData.append('candidat_id',candidatId);
      formData.append('societe_id',decryptedId);
      formData.append('ratecommunication',ratecommunication || 0);
      formData.append('rateenvironementdutravail',rateenvironementdutravail || 0);
      formData.append('ratecroissanceprofessionnelle',ratecroissanceprofessionnelle || 0);
      formData.append('rateremuneration',rateremuneration || 0);
      formData.append('ratecomportementethique',ratecomportementethique || 0);
      formData.append('rateculturediverse',rateculturediverse || 0);
      formData.append('ratesatisfactionglobale',ratesatisfactionglobale || 0);
      formData.append('review',review);
      const response = await ratingsociete(formData);

    if (response) {
      toast.success('🦄 Votre numerotation pour cette société est enregistré  avec succés!', {
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
    if((role ==="societe")||(role ==="employeur")){
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
        <h3>Donner une notation à la société {nom}</h3>
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
        <label>Environement du travail: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateenvironementdutravail(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateenvironementdutravail ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Croissance professionnelle: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatecroissanceprofessionnelle(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratecroissanceprofessionnelle ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}
      </div>
      <div className='row text-center'>
        <label>Rémuneration: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateremuneration(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateremuneration ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Comportement éthique et valeurs:: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRatecomportementethique(rating)}
              />
              <FaStar
                className="star"
                color={rating <= ratecomportementethique ? '#ffc107' : '#d2c6c6'}
                size={25}
              />
            </label>
          );
        })}

      </div>
      <div className='row text-center'>
        <label>Inclusion et diversité: </label>
        {[...Array(5)].map((star, index) => {
          const rating = index + 1;

          return (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                value={rating}
                onClick={() => setRateculturediverse(rating)}
              />
              <FaStar
                className="star"
                color={rating <= rateculturediverse ? '#ffc107' : '#d2c6c6'}
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

export default connect(mapStateToProps,{ ratingsociete })(RatingSociete);
