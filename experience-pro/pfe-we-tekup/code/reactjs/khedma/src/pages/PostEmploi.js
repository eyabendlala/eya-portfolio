import React , { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin,faCircleXmark,faMessage,faComments,faHourglassStart
  ,faHourglassEnd,faStopwatch20,faVenusMars,faUser, faMoneyBill,
  faCalendarCheck,faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { connect } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CryptoJS from 'crypto-js';
import { useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import Heart from 'react-animated-heart'; 
import CustomTagIcon from './CustomTagIcon'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import DOMPurify from 'dompurify';


import './PostEmploi.css';

const PostEmploi = ({ titre, image_emploi, localisation, type_emploi, onclick, user, id ,description,
  date_postulation,
  date_expiration,
  duree_offre,
  genre_demande,
  id_empl,
  intervalle_age,
  montant_paiement,
  experience,reduxRole,isAuthenticated }) => {
  //  console.log("pstemploi", id_empl) 
  

  const navigate = useNavigate();
  const [employerName, setEmployerName] = useState('');
  const [idUser, setIdUser] = useState('');
  const [emploiId, setEmploiId] = useState('');
  const [role, setRole] = useState('');
  const [prenom, setPrenom] = useState('');
  const [favoritedEmplois, setFavoritedEmplois] = useState([]); // State for keeping track of favorited emplois
  const [isFavori, setIsFavori] = useState(false); // State to track if the emploi is favorited
  const [isClick, setClick] = useState(false); // State for toggling heart animation
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [has_applied, setHas_applied] = useState(false);


  const isEmployeurOrSociete = ['employeur', 'societe'].includes(reduxRole);
  const isCandidat = ['candidat'].includes(reduxRole);

  const createChat = async () => {
    try {
      const chatData = {
        members: [id, user]
      };
      
      const response = await axios.post('/CreateChat/', chatData);
  
      // If the request is successful, you can handle the response here.
      //console.log('Chat created:', response.data);
      // Navigate the user to the new chat page
      navigate('/chat');
      // Optionally, you can close the modal here if needed.
      closeModal();
    } catch (error) {
      navigate('/chat');
      // Handle any errors that occur during the request.
      console.error('Error creating chat:', error);
    }
  };
  

// Fonction pour basculer l'état du clic
const handleHeartClick =  async() => {
  setClick(!isClick); // Inversion de la valeur actuelle de isClick
  await toggleFavoris(id_empl, id);
};


        const toggleFavoris = async (id_empl, idUser) => {
          // console.log("Toggle favoris called with emploiId:", id_empl, "and userId:", idUser);
        try {
           const response = await axios.post(`/toggle-favoris/`, {
            user_id: idUser,
            emploi_id: id_empl,
        });

          setIsFavori(response.data.isFavori); 

          setClick(response.data.isFavori);
    } catch (error) {
        console.error("Error toggling favoris:", error);
    }
};

useEffect(() => {
  const checkIfFavori = async () => {
    if (id && id_empl) {
      try {
        // Effectue la requête GET pour vérifier le statut de favori
        const response = await axios.get(`/check-favoris/`, {
          params: { user_id: id, emploi_id: id_empl }
        });
        // Mise à jour de l'état en fonction de la réponse de l'API
        setIsFavori(response.data.isFavori);

      } catch (error) {
        console.error("Error checking favoris:", error);
      }
    }
  };

  checkIfFavori();
}, [id, id_empl]); 



useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`/admin/users/${user}/`);
      setEmployerName(response.data.nom);
      setIdUser(response.data.id);
      setRole(response.data.role);
      if (response.data.role === "employeur") {
        setPrenom(response.data.prenom);
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchData();
}, [user]);

  
  const handleDetailEmployeurClick = () => {
    const encryptedId = CryptoJS.AES.encrypt(idUser.toString(), 'secretKey').toString();
    const encodedId = encodeURIComponent(encryptedId);
    if (role === "employeur") {
      navigate(`/detail-employeur/${encodedId}`);
    }
    if (role === "societe") {
      navigate(`/detail-societe/${encodedId}`);
    }
  };

  const openModal = async () => {
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
            toast.success('Application  envoyée avec succès', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 4000
            });
        }
    
       
    } catch (error) {
        // Log des erreurs si la requête échoue
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

  const heartIconClass = isFavori ? 'heart-icon-clicked' : 'heart-icon'; 

  return (
    <div className='body'>
      <section>
        <div className="postEmploi-container">
          <div className="postEmploi-content">
            <div className="postEmploi-card">
              <div className="postEmploi-card-content">
                <div className='postEmploi-image'>
                  <img src={image_emploi} alt="image" /><br />
                </div>
                <div className='postEmploi-titre'> 
                  <span className='titreEmploi'>{titre}</span>
                </div>
                {/* <div className='postEmploi-nom-entreprise'>
                  <span className='nom-entreprise'> {employerName}&nbsp; {prenom}</span>
                </div>  */}
                <div className='postEmploi-societe'>
                  <button onClick={handleDetailEmployeurClick} className='nom-societe' style={{ background: "white", borderColor: "white" }}>{employerName}&nbsp; {prenom}</button>
                </div>
                <div className='postEmploi-localisation'>
                  <div className="location-wrapper">
                    <span className='localisation'> {localisation}</span>
                  </div>
                </div>
                <div className="button-container">
                  <button className="button1" >{type_emploi}</button>


{/* Bouton pour Postuler ou Voir Plus */}
{!isAuthenticated ||isCandidat ? (
    <button className="button2" onClick={openModal}>Postuler</button>
  ) : (
    isEmployeurOrSociete && (
      <button className="button2" onClick={openModal}>Détails</button>
    )
  )}

                </div> 
                {user === id && (
                  <DeleteIcon className='delete-icon' onClick={onclick} />
                )}

{reduxRole  === 'candidat' && (
    <div className="icon-container">
      <CustomTagIcon isClicked={isFavori} onClick={handleHeartClick} />
    </div>
  )}
              </div>      
            </div>
          </div>
        </div>
      </section>
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
        {/* <h4>Offre d'emploi : Lisez et postulez.</h4> */}
        <div>
            {isCandidat && <h4>Offre d'emploi : Lisez et postulez.</h4>}
            {isEmployeurOrSociete && <h4>Offre d'emploi</h4>}
        </div>
        <div className="scrollable-description">
          {/* <p>{description}</p> */}
          <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}></div>
          <p> Date de publication: <br/><FontAwesomeIcon icon={faHourglassStart} className="blue-icon" /> {date_postulation}</p>
<p> Date d'expiration: <br/><FontAwesomeIcon icon={faHourglassEnd} className="blue-icon" /> {date_expiration}</p>
<p> Duree de l'offre: <br/><FontAwesomeIcon icon={faStopwatch20} className="blue-icon" /> {duree_offre}</p>
<p> Genre demandé: <br/><FontAwesomeIcon icon={faVenusMars} className="blue-icon" /> {genre_demande}</p>
<p> Intervalle d'age: <br/><FontAwesomeIcon icon={faUser} className="blue-icon" /> {intervalle_age}</p>
<p> Montant de paiement: <br/><FontAwesomeIcon icon={faMoneyBill} className="blue-icon" /> {montant_paiement}</p>
<p> Experience: <br/><FontAwesomeIcon icon={faCalendarCheck} className="blue-icon" /> {experience}</p>

        </div>
          {/* Afficher les boutons uniquement si l'utilisateur est un candidat */}
    {isCandidat && (
      <>
        {/* <button className="button1" onClick={createChat}> <FontAwesomeIcon icon={faComments} /> Connecter </button> */}
        {/* <button className="button2" onClick={() => applyToJob(id_empl, idUser)}>Postuler </button>        */}


        
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
        </>
      )}





        <br />
        <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} className="close-btn" />

      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  reduxRole: state.auth.user && state.auth.user.role,
  id: state.auth.user && state.auth.user.id,
});

const ConnectedPostEmploi = connect(mapStateToProps)(PostEmploi);

export default connect(mapStateToProps)(PostEmploi);