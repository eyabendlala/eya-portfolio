import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import './DashboardRecruteur.css'; 
import RecruiterNavbar from '../../components/RecruiterNavbar';
import Navbar from '../../components/Navbar';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import CryptoJS from 'crypto-js';
import { useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin,faCircleXmark,faMessage,faComments,faHourglassStart
    ,faHourglassEnd,faStopwatch20,faVenusMars,faUser, faMoneyBill,
    faCalendarCheck,faSignInAlt,faTimes } from '@fortawesome/free-solid-svg-icons';

    import DOMPurify from 'dompurify';

import CandidatDetails from './CandidatDetails'; 


// export const baseURL = 'http://127.0.0.1:8000';

const DashboardRecruteur  = ({ user }) => {

  const [mesOffres, setMesOffres] = useState([]);
  const [employerName, setEmployerName] = useState('');
  const [role, setRole] = useState('');
  const [prenom, setPrenom] = useState('');
  const [idUser, setIdUser] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); 
//serch application
  const [searchFullName, setSearchFullName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchResults, setSearchResults] = useState([]);
//Suivi candidature
  const [showCandidatures, setShowCandidatures] = useState(false); 
  const [candidatures, setCandidatures] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [errorShown, setErrorShown] = useState(false); // Ajout de l'état pour suivre l'erreur




const updateCandidatureStatus = (applicationId, newStatus) => {
  setCandidatures(prevApplications =>
    prevApplications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    )
  );
};


  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const handleCloseDetails = () => {
    setSelectedApplicationId(null);
  };
  
  const getStatusFromText = (text) => {
    switch (text.toLowerCase()) {
      case 'non traité':
        return 'pending'; 
      case 'accepté':
        return 'accepted';
      case 'rejeté':
        return 'rejected';
      default:
        return text; 
    }
  };
  useEffect(() => {
    // Si le modal est ouvert, désactiver le scroll du body
    if (selectedApplicationId) {
      document.body.classList.add('no-scroll');
    } else {
      // Sinon, permettre le scroll
      document.body.classList.remove('no-scroll');
    }
  
    // Nettoyage à la fermeture du modal
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [selectedApplicationId]);
// Fonction pour mettre à jour les résultats de recherche
useEffect(() => {
  let filteredCandidatures = candidatures.filter(application => {
    const searchFullNameLower = searchFullName.toLowerCase();
    const searchStatusLower = getStatusFromText(searchStatus).toLowerCase();

    const fullNameMatch = application.full_name.toLowerCase().includes(searchFullNameLower);
    const statusMatch = getStatusText(application.status).toLowerCase().includes(searchStatusLower);
    return fullNameMatch && statusMatch;
  });
  setSearchResults(filteredCandidatures);
}, [candidatures, searchFullName, searchStatus]);

// Fonction pour gérer la soumission du formulaire de recherche
const handleSearchSubmit = (event) => {
  event.preventDefault();
};



const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Non traité';
    case 'accepted':
      return 'Accepté';
    case 'rejected':
      return 'Rejeté';
    default:
      return status;
  }
};
  
  const handleCandidatureClick = async (emploiId) => {
    try {
        const response = await axios.get(`/emploi/${emploiId}/applications/`);
        setCandidatures(response.data);
        setSelectedJob(mesOffres.find(emploi => emploi.idEmploi === emploiId));
        setSelectedJobId(emploiId);
        setShowCandidatures(true); // Show candidatures section
    } catch (error) {

        toast.error('Aucune candidature trouvée pour le poste sélectionné', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

    }
};

  useEffect(() => {
    const fetchMesOffres = async () => {
      if (!user || !user.id) {
       // toast.error('Informations utilisateur non disponibles. Veuillez vous reconnecter.');
        return;
      }
  
      try {
          const response = await axios.get(`/api/emplois-par-recruteur/?recruteur=${user.id}`);
          // setMesOffres(response.data);
          const activeOffres = response.data.filter(emploi => emploi.is_active && !emploi.is_archived);
  
          setMesOffres(activeOffres); 

          if (activeOffres.length > 0) {
            setSelectedJobId(activeOffres[0].idEmploi);
            setSelectedJob(activeOffres[0]);
        }
      } catch (error) {
        if (!errorShown) {  
          // toast.error('Erreur lors de la récupération de vos offres d\'emploi');
          toast.error('Erreur lors de la récupération de vos offres d\'emploi', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          setErrorShown(true);  
        }
      }
    };
    
    fetchMesOffres();
  }, [user, errorShown]);

  useEffect(() => {
    if (selectedJobId) {
        handleCandidatureClick(selectedJobId);
    }
}, [selectedJobId]);

  useEffect(() => {
    mesOffres.forEach((emploi) => {
         axios.get(`/emploi/${emploi.idEmploi}/applications/count/`)
             .then((res) => {
                 setApplicationCounts((prevCounts) => ({
                     ...prevCounts,
                     [emploi.idEmploi]: res.data.application_count
                 }));
             })
             .catch((err) => console.log(err));
    });
}, [mesOffres]);


useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/admin/users/${user.id}/`);
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

  useEffect(() => {
    if (user && user.id) {
      setIdUser(user.id);
    }
  }, [user]);

  const openModal = async (emploi) => {
    setSelectedJob(emploi);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const deleteJob = async (emploiId) => {

    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
    if (confirmDelete) {
     console.log('Deleting event with ID:', emploiId);
   try {
     const response = await axios.delete(`/delete-emploi/${emploiId}/`);
     console.log('Event deleted successfully');
     setMesOffres(mesOffres.filter(emploi => emploi.id !== emploiId));

     toast.success('Événement supprimé avec succès !', {
       position: toast.POSITION.TOP_RIGHT,
       autoClose: 3000,
       className: "toast-light-blue",
       icon: <i className="fas fa-check-circle toast-icon-blue"></i>
     });

   } catch (error) {
     toast.error('Erreur lors de la suppression de l\'événement');
   }
 }
 };

  // Filter mesOffres based on the search term
  const filteredOffres = mesOffres.filter(emploi =>
    emploi.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="site-wrap"> 

    <Navbar></Navbar>
    <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-white font-weight-bold">Espace Recruteur</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Mes offres </strong></span>
              </div>
            </div>
          </div>
        </div>
     </section>
     <RecruiterNavbar />


<div className="main-container">


<div className={`mesOffres-container ${selectedApplicationId ? 'blurred' : ''}`}>

<div className={`emploi-container`}>
{/* Search Bar */}
<div className="search-container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '10px' }}>
  <form>
    <input
      type="text"
      placeholder="Rechercher une offre..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '100%' }} // Styles ajoutés ici

    />
  </form>
</div>
               {filteredOffres.map((emploi) => (
                   <div key={emploi.id} className="emploi-card" >
                       <div className="emploi-card-content">
                           <div className="postEmploi1-image">
                           {/* <img src={emploi.image_emploi} alt="image" /><br /> */}
                           <img src={`${emploi.image_emploi}`} alt="image" />

                           </div>
                           <div className="postEmploi1-titre">
                               <p>{emploi.titre}</p>
                           </div>
                           <div className='postEmploi1-nom-entreprise'>
                               <span className='nom-entreprise'> {employerName}&nbsp; {prenom}</span>
                                </div>
                             
                           <div className="postEmploi1-info">
                               <p className="info">Lieu: {emploi.localisation}</p>
                    
                           </div>
                           <div className="button-container1">
                               <button onClick={() => openModal(emploi)}>Voir Plus</button>

                               <span onClick={() => handleCandidatureClick(emploi.idEmploi)} className="candidature-counter"> 
                               <FontAwesomeIcon icon={faUser}/> 
                              {applicationCounts[emploi.idEmploi] || 0} 
                              </span>

                           </div>
                       </div>
                   </div>
                   
               ))}
          
           </div>



 {/* Display candidatures */}
 {showCandidatures && (
                <div className="candidature-container">
                  <center><h4>Candidatures pour: {selectedJob ? selectedJob.titre : ''}</h4></center> 
                    <div className="search-container">
                   <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        placeholder="Rechercher par nom complet..."
                        value={searchFullName}
                        onChange={(e) => setSearchFullName(e.target.value)}
                     />
                     <input
                        type="text"
                        placeholder="Rechercher par statut..."
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                     /> 
                  </form>
                   </div>
      {searchResults.length > 0 ? (
                    searchResults
        .sort((a, b) => {
          // Order: Non traité (pending), Accepté (accepted), Rejeté (rejected)
          const order = ['pending', 'accepted', 'rejected'];
          return order.indexOf(a.status.toLowerCase()) - order.indexOf(b.status.toLowerCase());
        })
        .map((application) => (
                        <div key={application.id} className="candidature-item">
                            <p className="nom-du-candidat">Nom du candidat: {application.full_name}</p>
                            <p>Date de candidature: {new Date(application.applied_on).toLocaleDateString()}</p>
                            <p className={`status ${application.status.toLowerCase()}`}>
                                Status: {getStatusText(application.status)}
                            </p> 
                            <button className="details-button" onClick={() => handleViewDetails(application.id)}>Voir les détails</button> 
                        </div>
                       ))
                      ) : (
                          <p>Aucune candidature trouvée pour le poste sélectionné.</p>
                      )}

                  </div>
)}

</div>




{selectedApplicationId && (
     <div className="candidat-details-overlay"> 
        <div >
          <button onClick={handleCloseDetails} className="close-buttonn">
              <FontAwesomeIcon icon={faTimes} />
          </button>
          <CandidatDetails 
          applicationId={selectedApplicationId}
          onStatusUpdate={updateCandidatureStatus} // Passes the function as a prop

          />
        </div>
    </div>
      )}
    </div>


    




    

      <ToastContainer  />
      {selectedJob && (
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
        <div className="scrollable-description">
          <h4>{selectedJob.titre}</h4>
          <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedJob.description) }}></div>

          <p> Date de publication: <br/><FontAwesomeIcon icon={faHourglassStart} className="blue-icon" /> {selectedJob.date_postulation}</p>
<p> Date d'expiration: <br/><FontAwesomeIcon icon={faHourglassEnd} className="blue-icon" /> {selectedJob.date_expiration}</p>
<p> Duree de l'offre: <br/><FontAwesomeIcon icon={faStopwatch20} className="blue-icon" /> {selectedJob.duree_offre}</p>
<p> Genre demandé: <br/><FontAwesomeIcon icon={faVenusMars} className="blue-icon" /> {selectedJob.genre_demande}</p>
<p> Intervalle d'age: <br/><FontAwesomeIcon icon={faUser} className="blue-icon" /> {selectedJob.intervalle_age}</p>
<p> Montant de paiement: <br/><FontAwesomeIcon icon={faMoneyBill} className="blue-icon" /> {selectedJob.montant_paiement}</p>
<p> Experience: <br/><FontAwesomeIcon icon={faCalendarCheck} className="blue-icon" /> {selectedJob.experience}</p>

        </div>
        <button className="button2" onClick={() => deleteJob(selectedJob.id)} style={{ width: '115px', margin: '10px 0' }}>Supprimer</button>
        <br />
        <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} className="close-btn" />

      </Modal>
      )}

    </div>
  );

};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user, 
        role: state.auth.user && state.auth.user.role,
        id: state.auth.user && state.auth.user.id,
    };
  };

export default connect(mapStateToProps)(DashboardRecruteur);
