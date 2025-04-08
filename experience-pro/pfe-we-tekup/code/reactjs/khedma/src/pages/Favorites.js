import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import Navbar from '../components/Navbar';
import './Favorites.css';
import CustomTagIcon from '../pages/CustomTagIcon';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin,faCircleXmark,faMessage,faComments,faHourglassStart
  ,faHourglassEnd,faStopwatch20,faVenusMars,faUser, faMoneyBill,
  faCalendarCheck,faSignInAlt} from '@fortawesome/free-solid-svg-icons';
  import { useNavigate} from 'react-router-dom';
  import DOMPurify from 'dompurify';

import CandidatNavbar from '../components/CandidatNavbar';

function Favorites({ user,id_empl,id,role }) {

  const [favorites, setFavorites] = useState([]);
  const [idUser, setIdUser] = useState('');
  const [emploiId, setEmploiId] = useState('');
  const [type_emploi, setType_emploi] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEmploi, setSelectedEmploi] = useState(null);
  const [has_applied, setHas_applied] = useState(false);

  const navigate = useNavigate();
  
  
  const supprimerFavoris = async (emploiId, userId) => {
    console.log("Suppression du favori avec emploiId:", emploiId, "et userId:", userId);
    try {
        // Supposons que vous avez un endpoint DELETE pour la suppression
        const response = await axios.delete(`/api/supprimer-favoris/${emploiId}/${userId}/`)
        console.log("Response from delete from Favoris API:", response.data);

        if (response.data.status === 'success') {
            // Met à jour l'état pour supprimer l'emploi de la liste des favoris
            // setFavorites(currentFavorites => currentFavorites.filter(favorite => favorite.emploi.id !== emploiId));
            await fetchFavorites();

            
            toast.success('Emploi supprimé des favoris.', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 4000
            });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du favori:', error);
        toast.error('Un problème est survenu lors de la suppression.');
    }
};

const applyToJob = async (emploiId, idUser) => {
  console.log(`Tentative de postulation à l'emploi ID ${emploiId} par l'utilisateur ID ${idUser}`);

  try {
      // Envoyer la requête POST au serveur avec emploiId et userId
      const response = await axios.post('/apply/', { 
          emploi_id: emploiId,
          user_id: idUser
      });

      // console.log("Réponse reçue de l'API de postulation :", response.data);
      if (response.status === 201) {
          console.log("Postulation soumise avec succès.");
          toast.success('Application  envoyée avec succès', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          }); 
             }
  } catch (error) {
      console.error("Erreur lors de la tentative de postulation :", error);

      // Gestion des réponses d'erreur du serveur
      if (error.response && error.response.status === 400) {
          console.warn("Tentative de postulation répétée détectée.");
          alert("You have already applied for this job");
      } else {
          // Gestion des autres erreurs
          console.error("Une erreur inattendue est survenue lors de la postulation.");
          alert("An error occurred while applying for this job");
      }
  }
};

const fetchFavorites = async () => {
  console.log('Fetching favorites for user ID:', idUser); 
  if (!idUser) {
    console.log('No user ID provided, aborting the fetch operation.');
    return;
  }
  try {
    const response = await axios.get('/api/favoris/', {
      params: { user_id: idUser }
    });
    console.log(`Favorites fetched successfully for user ID ${idUser}:`, response.status, response.data);
    setFavorites(response.data);
  } catch (error) {
    console.error(`Error fetching favorites for user ID ${idUser}:`, error.response?.status, error.message);
  }
};


  useEffect(() => {
    if (user && user.id) {
      setIdUser(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [idUser]);

  
  // const openModal = async (emploi) => {
  //   setSelectedEmploi(emploi); 
  //   setModalIsOpen(true);
  // }
  const openModal = async (emploi) => {
    setSelectedEmploi(emploi); 

    setModalIsOpen(true);

    try {
      // Vérifier si l'utilisateur a déjà postulé à cet emploi
      const response = await axios.get(`/has-user-applied/${id}/${id_empl}/`);

      //  console.log('Application check response:', response.data);
      // Si l'utilisateur a déjà postulé, mettre à jour l'état pour refléter cela
      if (response.data.has_applied) {
        setHas_applied(true);
      } else {
        setHas_applied(false);
      }
    } catch (error) {
      console.error('Error checking application:', error);
      toast.error('Erreur lors de la vérification de la postulation à l\'emploi');
    }
  };


  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="site-wrap">
      <Navbar></Navbar>
      <ToastContainer
    
      />
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-white font-weight-bold">Mes Emplois Favoris</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Mes Favoris </strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CandidatNavbar />

    <div>  
    </div>
    <div className="favorites-header">
        <h2>Mes Favoris</h2>
    </div>

    <div className='body'>
      { favorites.length > 0 ? (
       <div className={"containerr mt-3"}>
       {favorites.map(favorite => (
      <div className={"favoriteCard"} key={favorite.id}>
        <div className={"favorite-image"}> 
           <img src={`${favorite.emploi.image_emploi}`} alt="Event" />
        </div>

        <h3 className={"favorite-title"}>{favorite.emploi.titre} </h3>
          <p className={"favoriteLocation"}>{favorite.emploi.localisation}</p>
      
          <div className="button-containerr">
                  <button className="buttonP" >{favorite.emploi.type_emploi}</button>
                  <button className="buttonM" onClick={() => openModal(favorite.emploi)}>Postuler</button>
         </div> 
          <div className="icon-containerr">
           <CustomTagIcon 
                isClicked={true} // L'emploi est actuellement un favori
                onClick={() => supprimerFavoris(favorite.emploi.idEmploi, idUser)} 
              />
             </div> 
          </div>
    ))}
  </div>
) : (
  <p>Vous n'avez pas encore ajouté d'offres d'emploi à vos favoris.</p>
)}
    </div>
    {selectedEmploi && (

    <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Example Modal"
  className="custom-modal"
  overlayClassName="custom-overlay"
  id="jobModal"
  style={{
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%', 
      height: 'auto', 
      maxWidth: '50%', 
      maxHeight: '90%', 
    }
  }}
>
        <h4>Offre d'emploi : Lisez et postulez.</h4>
        <div className="scrollable-description">
          {/* <p>{selectedEmploi.description}</p> */}
          <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmploi.description) }}></div>

          <p> Date de postulation: <br/><FontAwesomeIcon icon={faHourglassStart} className="blue-icon" /> {selectedEmploi.date_postulation}</p>
<p> Date d'expiration: <br/><FontAwesomeIcon icon={faHourglassEnd} className="blue-icon" /> {selectedEmploi.date_expiration}</p>
<p> Duree de l'offre: <br/><FontAwesomeIcon icon={faStopwatch20} className="blue-icon" /> {selectedEmploi.duree_offre}</p>
<p> Genre demandé: <br/><FontAwesomeIcon icon={faVenusMars} className="blue-icon" /> {selectedEmploi.genre_demande}</p>
<p> Intervalle d'age: <br/><FontAwesomeIcon icon={faUser} className="blue-icon" /> {selectedEmploi.intervalle_age}</p>
<p> Montant de paiement: <br/><FontAwesomeIcon icon={faMoneyBill} className="blue-icon" /> {selectedEmploi.montant_paiement}</p>
<p> Experience: <br/><FontAwesomeIcon icon={faCalendarCheck} className="blue-icon" /> {selectedEmploi.experience}</p>

        </div>
        
       

        {/* Afficher le bouton "Postuler" uniquement s'il n'a pas déjà postuler */}
        {!has_applied && (
        <button className="button1" onClick={() => applyToJob(id_empl, id)}>
           <FontAwesomeIcon icon={faSignInAlt} /> Postuler
        </button>
        )}
        {/* Afficher un message si l'utilisateur a déjà postulé */}
        {has_applied && (
        <div className="button-disabled">
        <button className="button1" disabled>
         <FontAwesomeIcon icon={faSignInAlt} /> Postuler
        </button>
        
        <p className="already-participated-message">Vous avez déjà postulé à cet emploi</p>
       </div>
        )}

        <br />
        <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} className="close-btn" />

      </Modal>
            )}

    </div>

  );
}

const mapStateToProps = (state) => {
  
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user, 
        role: state.auth.user && state.auth.user.role,
        id: state.auth.user && state.auth.user.id,
    };
  };
  const ConnectedFavorites = connect(mapStateToProps)(Favorites);
  
  export default connect(mapStateToProps)(Favorites);