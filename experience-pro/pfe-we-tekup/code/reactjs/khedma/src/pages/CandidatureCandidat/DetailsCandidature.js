import React, { useState, useEffect } from 'react';
import '../EspaceRecruteur/CandidatDetails.css';
import { faUser, faAddressCard, faPhone, faEnvelope, faLocationDot, faFlag, faBirthdayCake,faComments,faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useNavigate} from 'react-router-dom';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import Chat from '../../pages/chat/Chat';


//  export const baseURL = 'http://127.0.0.1:8000';

const DetailsCandidature = ({ applicationId  }) => {
  const [candidatureDetails, setCandidatureDetails] = useState(null); 
  const navigate = useNavigate();   
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    console.log(`URL applicationId param: ${applicationId}`);

    const fetchData = async () => {
      try {
      // Fetch candidature details using the id directly
      console.log(`Fetching details for application ID: ${applicationId}`);

      const response = await axios.get(`/application/${applicationId}/details/`);
      console.log("API Response:", response.data);
        setCandidatureDetails(response.data);

      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la candidature:", error);
        toast.error('Erreur lors de la récupération des détails du candidat.');
      }
    };

    fetchData();
  }, [applicationId ]);

  if (!candidatureDetails) {
    return <div>Chargement des détails...</div>;
  }
  

  // const handleChatRedirect = () => {
  //   navigate(`/chat/`);
  // };

  const handleChatToggle = () => {
    setIsChatVisible(prevState => !prevState);
  };

  const handleCloseChat = () => {
    setIsChatVisible(false);
  };

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
      console.error("Erreur lors de l'envoi de l'email:", error);
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
    

<div className="container mt-5">
        <div className="row">

        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
          {/* <h1>Détails de candidature</h1> */}
        </div>

         <div className=" col-12">
          {candidatureDetails.image_emploi && (
            <img className="candidate-image-circle" src={candidatureDetails.image_emploi} alt="logo de l'entreprise" />
          )}
         </div>
        </div>
         <div className="row gutters soustitres"  style={{marginLeft:"5px"}}>

             <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="mt-3 mb-2">Information Général</h4>
                <hr className="border border-1 custom-hr" />
             </div>
             
             <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
  <div className="form-group">
    &nbsp;&nbsp;
    <strong>Description de l'emploi: </strong>
    <div 
      style={{ color: "black", fontSize: "18px", flex: 1 }} 
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(candidatureDetails.description) }}
    ></div>
  </div>
</div>
         {/* style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(candidatureDetails.description) }}>  */}
             <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
               <div className="form-group">
               <FontAwesomeIcon icon={faLocationDot} style={{ color: "black" }} />&nbsp;&nbsp;
               <strong>Lieu: </strong> <span style={{ color: "black", fontSize: "18px", display: "block" }}>{candidatureDetails.localisation}</span>
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
                                <span style={{ color: "black",fontSize:"18px", display: "block" }}>{candidatureDetails.recruteur_email}</span>
                            </div>
                            </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                <FontAwesomeIcon icon={faPhone} style={{ color: "black" }} />&nbsp;&nbsp;
                                <strong>Numéro de Téléphone: </strong>
                                <span style={{ color: "black",fontSize:"18px", display: "block" }}>{candidatureDetails.recruteur_numero_telephone}</span>
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
  );
};

export default DetailsCandidature;
