import React, { useState, useEffect } from 'react';
import './CandidatDetails.css';
import { useNavigate} from 'react-router-dom';
import { faUser, faAddressCard, faPhone, faEnvelope, faLocationDot, faFlag, faBirthdayCake, faComments, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Chat from '../../pages/chat/Chat';
import { Spinner } from 'react-bootstrap'; 

// export const baseURL = 'http://127.0.0.1:8000';

const CandidatDetails = ({ applicationId, onStatusUpdate   }) => {
  // const { applicationId  } = useParams();
  const [candidatureDetails, setCandidatureDetails] = useState(null); 
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const [isChatVisible, setIsChatVisible] = useState(false);

  const [toastDisplayed, setToastDisplayed] = useState(false); // Nouvelle état pour le toast
  const [acceptDisabled, setAcceptDisabled] = useState(false);
  const [rejectDisabled, setRejectDisabled] = useState(false);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();   


  const handleChatToggle = () => {
    setIsChatVisible(prevState => !prevState);
  };

  const handleCloseChat = () => {
    setIsChatVisible(false);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
      // Fetch candidature details using the id directly
      const response = await axios.get(`/application/${applicationId}/details/`);
        setCandidatureDetails(response.data);

      } catch (error) {
        toast.error('Erreur lors de la récupération des détails du candidat.');
      }
    };

    fetchData();
  }, [applicationId ]);

  if (!candidatureDetails) {
    return <div>Chargement des détails...</div>;
  }


  const handleAccept = async () => {
    if (acceptDisabled) return; // Ignore le clic si le bouton est désactivé
    setAcceptDisabled(true);
    setLoading(true); 

    try {
      await axios.patch(`/application/${applicationId}/status/`, { status: 'accepted' });
      setCandidatureDetails({ ...candidatureDetails, status: 'accepted' });

      if (!toastDisplayed) {
        toast.success('Candidature acceptée avec succès.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        setToastDisplayed(true);
        onStatusUpdate(applicationId, 'accepted'); // Appel du callback pour mettre à jour la liste des candidatures

      }

    } catch (error) {
      toast.error('Erreur lors de l\'acceptation de la candidature.');
    }
    finally {
      setLoading(false); // Masquer le spinner après l'appel API
      setAcceptDisabled(false);
    }
  };

  const handleReject = async () => {
    if (rejectDisabled) return; // Ignore le clic si le bouton est désactivé
    setRejectDisabled(true);
    setLoading(true); 

    try {
      await axios.patch(`/application/${applicationId}/status/`, { status: 'rejected' });
      setCandidatureDetails({ ...candidatureDetails, status: 'rejected' });

      if (!toastDisplayed) {
        toast.success('Candidature rejetée avec succès.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        setToastDisplayed(true);
        onStatusUpdate(applicationId, 'rejected'); // Appel du callback pour mettre à jour la liste des candidatures

      }

    } catch (error) {
      toast.error('Erreur lors du rejet de la candidature.');
    }
    finally {
      setLoading(false); // Masquer le spinner après l'appel API
      setRejectDisabled(false);
    }
  };


  // const handleChatRedirect = () => {
  //   navigate(`/chat/`);
  // };

  const handleWhatsappContact = () => {
    const phoneNumber = candidatureDetails.numero_telephone;
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  

  const handleEmailContact = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/send-email/`, {
        to: toEmail, // Adresse email du destinataire
        subject: emailSubject, // Sujet de l'email
        message: emailContent // Contenu du message
      });
      toast.success('Email envoyé avec succès!');
      setShowEmailForm(false);
      setToEmail(''); // Réinitialiser l'adresse email du destinataire
      setEmailSubject(''); // Réinitialiser le sujet
      setEmailContent(''); // Réinitialiser le contenu
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email.');
    }
  };
  
  const handleKhedmaSiteContact = () => {
    window.open(`https://khedma.site/contact`, '_blank');
  };



// Désactivation des boutons en fonction du statut
const isAccepted = candidatureDetails && candidatureDetails.status === 'accepted';
const isRejected = candidatureDetails && candidatureDetails.status === 'rejected';
  
  return (
    <div >
      <ToastContainer
       
      />

<div className="candidat-details-wrapper">
  <div className="candidat-details-content">
     <div className="container mt-5">

        <div className="row">

        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
          {/* <h1>Détails du Candidat</h1> */}
        </div>

         <div className=" col-12">
          {candidatureDetails.image && (
            <img className="candidate-image-circle" src={candidatureDetails.image} 
            alt="Photo du candidat"
            style={{ marginBottom: "0px" }} 
            />
          )}
         </div>
        </div>
         <div className="row gutters soustitres"  style={{marginLeft:"5px"}}>

             <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="mt-3 mb-2">Information Général</h4>
                <hr className="border border-1 custom-hr"
                 />
                
             </div>
  
             <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
               <div className="form-group">
               <FontAwesomeIcon icon={faLocationDot} style={{ color: "black" }} />&nbsp;&nbsp;
               <strong>Adresse: </strong> <span style={{ color: "black", fontSize: "18px" }}>{candidatureDetails.adresse}</span>
              </div>
             </div>

             <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
               <div className="form-group">
               <FontAwesomeIcon icon={faUser} style={{ color: "black" }} />&nbsp;&nbsp;
               <strong>Nom & Prénom: </strong> <span style={{ color: "black", fontSize: "18px" }}>{candidatureDetails.full_name}</span>
              </div>
             </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
               <div className="form-group">
                  <FontAwesomeIcon icon={faFlag} style={{ color: "black" }} />&nbsp;&nbsp;
                  <strong>Nationalité: </strong> <span style={{ color: "black", fontSize: "18px" }}>{candidatureDetails.nationalite}</span>
              </div>
           </div>
           <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
               <div className="form-group">
                  <FontAwesomeIcon icon={faBirthdayCake } style={{ color: "black" }} />&nbsp;&nbsp;
                  <strong>Date de Naissance: </strong> <span style={{ color: "black", fontSize: "18px" }} >{candidatureDetails.date_naissance}</span>
              </div>
           </div>
         </div>

         <div className="row gutters soustitres" style={{marginLeft:"5px"}}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <h4 className="mt-3 mb-2">Contact</h4>
                            <hr className="border border-1 custom-hr" />
                        </div>
                        
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: "black" }} />&nbsp;&nbsp;
                                <strong>Email: </strong>
                                <span style={{ color: "black",fontSize:"18px", display: "block" }}>{candidatureDetails.email}</span>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                <FontAwesomeIcon icon={faPhone} style={{ color: "black" }} />&nbsp;&nbsp;
                                <strong>Numéro de Téléphone: </strong>
                                <span style={{ color: "black",fontSize:"18px", display: "block" }}>{candidatureDetails.numero_telephone}</span>
                                </div>
                        </div>
       
                </div>                
            <div className="row gutters soustitres" style={{ marginLeft: "5px" }}>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="mt-3 mb-2">Résumé professionnel</h4>
                <hr className="border border-1 custom-hr" />
                <div className="form-group">
                  <a href={candidatureDetails.cv_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Voir le CV</a>
                </div>
              </div>
            </div>


            <div className="row mt-4 justify-content-center ">
               <div className="col-3 text-center icon-wrapper">
               <button className="btn-action" onClick={handleWhatsappContact}>
                 <FontAwesomeIcon 
                    icon={faWhatsapp} 
                    className="icon icon-whatsapp" 
                    title="Contacter sur WhatsApp"
                />
                <span className="icon-text">WhatsApp</span>
                </button>
               </div>
  

               <div className="col-3 text-center icon-wrapper">
                 <button className="btn-action" onClick={handleChatToggle}>
                    <FontAwesomeIcon 
                       icon={faComments} 
                       className="icon icon-chat" 
                       title="Contacter via Chat"
                    />
              <span className="icon-text">KhedmaSite</span>
              </button>
             {isChatVisible && (
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

         
        <div className="col-3 text-center icon-wrapper">
    <button className="btn-action" onClick={handleEmailContact}>
      <FontAwesomeIcon 
        icon={faEnvelope} 
        className="icon icon-envelope" 
        title="Contacter par Email"
      />
      <span className="icon-text">Email</span>
    </button>
    {showEmailForm && (
      <form onSubmit={handleEmailSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="toEmail">Adresse Email du Destinataire:</label>
          <input
            type="email"
            id="toEmail"
            className="form-control"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailSubject">Sujet de l'Email:</label>
          <input
            type="text"
            id="emailSubject"
            className="form-control"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailContent">Contenu de l'Email:</label>
          <textarea
            id="emailContent"
            className="form-control"
            rows="5"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Envoyer</button>
        <button type="button" className="btn btn-secondary" onClick={() => setShowEmailForm(false)}>Annuler</button>
      </form>
    )}
  </div>


     </div>
         </div>
           </div>

  </div>
 {/* Fixed Actions */}
 <div className="candidat-actions">
<div className="row mt-4 justify-content-center">
  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 text-center">
    <button className={`btn btn-success ${isAccepted ? 'disabled-button' : ''}`} style={{ maxWidth: "200px", width: "100%" }} onClick={handleAccept} disabled={isAccepted}>
      Accepter
    </button>
    {isAccepted && <p className="already-clicked-message" style={{ marginTop: "5px" }}>Candidature acceptée</p>}
  </div>
  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 text-center">
    <button className={`btn btn-danger ${isRejected ? 'disabled-button' : ''}`} style={{ maxWidth: "200px", width: "100%" }} onClick={handleReject} disabled={isRejected}>
      Rejeter
    </button>
    {isRejected && <p className="already-clicked-message" style={{ marginTop: "5px" }}>Candidature refusée</p>}
  </div>
</div>


 {/* Indicatif de Chargement */}
 {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
          <p>Chargement en cours...</p>
        </div>
      )}


  </div>

 

  

    </div>
  );
};

export default CandidatDetails;
