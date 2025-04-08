import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import Navbar from '../../components/Navbar';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt,faHourglassStart, faMapMarkerAlt, faAlignLeft, faTag, faSitemap, faCircleXmark, faDollarSign, faCalendar  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './ParticipateEvent.css'; 


const ParticipateEvent = ({user , isAuthenticated }) => {

  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [idUser, setIdUser] = useState('');
  const [participated, setParticipated] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showParticipateButton, setShowParticipateButton] = useState(false);
  const [cancelingParticipation, setCancelingParticipation] = useState(false);

  //Filtred 
  const [displayedEvents, setDisplayedEvents] = useState([]); // État pour les événements après filtrage
  const [locationFilter, setLocationFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [sectors, setSectors] = useState([]);
  const regions = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
    'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia',
    'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
    'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  const navigate = useNavigate();
   
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    axios.get('/secteurs/')  
      .then(response => {
        setSectors(response.data);  
        console.log('Secteurs récupérés:', response.data);  
      })
      .catch(error => {
        console.log('Erreur lors de la récupération des secteurs:', error);  
      });
  }, []);

   useEffect(() => {
     setShowParticipateButton(!participated);
    }, [participated]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/event-list/');
        
         // Affiche uniquement les événements actifs et non archivés
       const visibleEvents = response.data.filter(event => event.is_active && !event.is_archived);
       setEvents(visibleEvents); 

       setDisplayedEvents(response.data);

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);


  const resetFilters = () => {
    setLocationFilter('');
    setSectorFilter('');
    setPeriodFilter('');
    setSearchQuery(''); 

  }

  const applyFiltersAndSearch = () => {
    let filtered = events;
  
    let today = new Date();
    const todayStart = new Date(today).setHours(0,0,0,0);
    const todayEnd = new Date(today).setHours(23,59,59,999);
  
    let calculateToday = new Date();
    const startOfThisWeek = new Date(calculateToday.setDate(calculateToday.getDate() - calculateToday.getDay() + 1));
    let calculateMonth = new Date(); // Pour le calcul "ceMois", nous devons de nouveau éviter les effets de bord
    const startOfThisMonth = new Date(calculateMonth.getFullYear(), calculateMonth.getMonth(), 1);
  
    // Filtre par période
    filtered = filtered.filter(event => {
      const eventDate = event.date ? new Date(event.date) : null;
  
      if (periodFilter === "aujourdhui" && eventDate) {
        return eventDate >= todayStart && eventDate <= todayEnd;
      } else if (periodFilter === "cetteSemaine" && eventDate) {
        return eventDate >= startOfThisWeek && eventDate < new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() + 7);
      } else if (periodFilter === "ceMois" && eventDate) {
        return eventDate.getMonth() === startOfThisMonth.getMonth() && eventDate.getFullYear() === startOfThisMonth.getFullYear();
      } else {
        return true; // Si aucun filtre de période n'est sélectionné, tous les évènements passent ce filtre.
      }
    });
  
  
    if (sectorFilter) {
      filtered = filtered.filter(event =>
        event.secteurs_noms && event.secteurs_noms.map(nom => nom.toLowerCase()).includes(sectorFilter.toLowerCase())
      );
  }
  filtered = filtered.filter(event => {
    return !locationFilter || event.location.toLowerCase().includes(locationFilter.toLowerCase());
  });
    // Recherche
    if (searchQuery) {
      const searchQueryNormalized = searchQuery.replace(/\s+/g, '').toLowerCase();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        const eventDateExpiration = new Date(event.date_expiration).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        const eventDateNormalized = eventDate.replace(/\s+/g, '').toLowerCase();
        const eventDateExpirationNormalized = eventDateExpiration.replace(/\s+/g, '').toLowerCase();
  
        return event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eventDateNormalized.includes(searchQueryNormalized) ||
          eventDateExpirationNormalized.includes(searchQueryNormalized);
      });
    }
  
    setDisplayedEvents(filtered);
  };
  
  useEffect(() => {
    applyFiltersAndSearch(); 
  }, [locationFilter, sectorFilter, searchQuery, events, periodFilter]); 

  const openModal = async (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  
    try {
      const response = await axios.get(`/check-participation/${event.id}/${idUser}/`);
      
      // console.log('Check participation API called successfully');
      //  console.log('Participation check response:', response.data);
      // Si l'utilisateur a déjà participé, mettre à jour l'état pour refléter cela
      if (response.data.participated) {
        setParticipated(true);
      } else {
        setParticipated(false);
      }
    } catch (error) {
      console.error('Error checking participation:', error);
      toast.error('Erreur lors de la vérification de la participation à l\'événement');
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };

// const confirmParticipation = async (eventId, userId) => {
//     try {
//         console.log('Vérifiez la validité de eventId :', eventId);
//         console.log('Vérifiez la validité de userId :', userId);

//         const checkResponse = await axios.get(`http://127.0.0.1:8000/check-participation/${eventId}/${userId}/`);
//         console.log("Response from check participation API:", checkResponse.data);

//         if (checkResponse.data.participated) {
//             toast.error('Vous avez déjà participé à cet événement');
//         } else {
//             const response = await axios.post(`http://127.0.0.1:8000/confirm-participation/`, {
//                 user_id: userId,
//                 event_id: eventId,
//             });
//             console.log("Response from confirm participation API:", response.data);

//             closeModal();
//             toast.success('Participation effectuée avec succès');
//             setCancelingParticipation(false);

//         }
//     } catch (error) {
//         console.error('Error confirming participation:', error);
//         toast.error('Erreur lors de la confirmation de la participation à l\'événement');
//         setCancelingParticipation(false);

//     }
// };

// const cancelParticipation = async (eventId, userId) => {
//   try {
//     const response = await axios.delete(`http://127.0.0.1:8000/cancel-participation/${eventId}/${userId}/`);
//     console.log("Response from cancel participation API:", response.data);

//     setParticipated(false);

//     toast.success('Votre annulation de participation a été effectuée avec succès');
//   } catch (error) {
//     console.error('Error canceling participation:', error);
//     toast.error('Erreur lors de l\'annulation de la participation à l\'événement');
//   }
// };


useEffect(() => {
  if (user && user.id) {
    setIdUser(user.id);
  }
}, [user]);


  return (
    <div className="participate-event-wrapper">
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: `url(${backgroundImg})` }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h3 className="text-white font-weight-bold">Cherchez Votre Prochain Evénement!</h3>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Offres des Evenement Disponibles</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Row className="justify-content-md-center">
  <Col md={8} className="d-flex justify-content-center"> 
    <div className="mt-3" style={{ width: '90vw', maxWidth: '100%' }}> 
      <input 
        type="text" 
        value={searchQuery} 
        onChange={handleSearch} 
        className="form-control" 
        placeholder="Rechercher par titre, lieu, date ou prix " 
      />
    </div>    
  </Col>
</Row>

  <Row className="justify-content-md-center">
  <Col md={2}>
  <FormGroup>
    <select
      className="form-control mt-1"
      value={periodFilter}
      onChange={(e) => setPeriodFilter(e.target.value)}
    >
      <option value="">Choisir une période</option>
      <option value="aujourdhui">Aujourd'hui</option>
      <option value="cetteSemaine">Cette semaine</option>
      <option value="ceMois">Ce mois</option>
    </select>
  </FormGroup>
</Col>

   <Col md={2}>
  <FormGroup>
    <Form.Select
      className="form-control mt-1"
      value={locationFilter}
      onChange={(e) => setLocationFilter(e.target.value)}
    >
      <option value=''>Toutes les Régions</option>
      {regions.map((location, index) => (
        <option key={index} value={location}>{location}</option>
      ))}
    </Form.Select>
  </FormGroup>
</Col>

  <Col md={2}>
    <FormGroup>
      <Form.Select
        className="form-control mt-1"
        value={sectorFilter}
        onChange={(e) => setSectorFilter(e.target.value)}
      >
      <option value=''>Tous les Secteurs</option>
      {sectors.map((secteur) => (
            <option key={secteur.id} value={secteur.nom}>{secteur.nom}</option>
          ))}
      </Form.Select>
    </FormGroup>
  </Col>


  <Col md={2} className="d-flex align-items-end">
    <Button variant="outline-secondary" onClick={resetFilters} style={{ marginLeft: '30px' }}>Annuler les filtres</Button>
  </Col>
</Row>

<Container className="mt-5"> {/* Utiliser Container au lieu de "event-container" pour une largeur responsive contrôlée par Bootstrap */}
{/* <Row className="justify-content-center">
    <Col>
      <h2 className="text-center modern-title">Liste des Événements:</h2> 
    </Col>
  </Row> */}
<Row className="justify-content-center gx-2 ">
      {displayedEvents.map((event) => (
        <Col md={4} key={event.id} className="mb-4 px-5">
          <div className="postEvent-card">
            <div className="postEvent-card-content">
              <div className="postEvent-image">
                {/* <img  src={`http://127.0.0.1:8000${event.image}`} alt="Event" /> */}
                <img src={event.image} alt="Event" />

              </div>
              <div className="postEvent-titre">
                <h2 className="titreEvent">{event.title}</h2>
                
              </div>
              <div className="postEvent-localisation">
             <p className="localisation">
             <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'skyblue' }} /> Lieu: {event.location}
           </p>
          </div>
              <div className="postEvent-localisation">
             <p className="localisation">
               <FontAwesomeIcon icon={faCalendar} className="mr-2" style={{ color: 'skyblue' }}/>Date_début: {new Date(event.date).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
             </div>
        
             <div className="postEvent-localisation">
            <p className="localisation">
             <FontAwesomeIcon icon={faSitemap} style={{ color: 'skyblue' }} /> Secteur: 
             {event.secteurs_noms && event.secteurs_noms.length > 0 ? event.secteurs_noms.join(', ') : 'Non spécifié'}
            </p>
            </div>
                
              <div className="postEvent-expiration">
                <p className="expiration"> Expire le: {new Date(event.date_expiration).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="button-container">
                  <button className="button-supprimer" style={{ width: '115px' }} onClick={() => openModal(event)}>Voir Plus</button>
              
              </div>
            </div>
          </div>
          </Col>

        ))}
  </Row>

{selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modall"
          className="custom-modal-eventt"
          overlayClassName="custom-overlayy"
          id="jobModall"
          style={{
            content: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              minHeight: '55vh', 
              maxWidth: '50%',
              maxHeight: '70vh', 
              overflowY: 'auto' 
            }
          }}
        >
<div className="scrollable-description" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <h4>{selectedEvent.title}</h4>
            <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEvent.description_event) }}></div>
            <p style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <FontAwesomeIcon icon={faDollarSign} className="blue-icon" /> Prix:<br/>{selectedEvent.price} DT
    </p>
</div>
  
{/* Afficher le bouton "Annuler participation" uniquement si l'utilisateur a déjà participé */}
{/* {participated && (
        <div className="button-container">
          <button className="button-supprimer" style={{ width: '155px', height: '55px' }} onClick={() => cancelParticipation(selectedEvent.id, idUser)} disabled={cancelingParticipation}>
            {cancelingParticipation ? 'Annulation en cours...' : 'Annuler participation'}
          </button>
        </div>
      )} */}


{/* Afficher le bouton "Participer" uniquement s'il n'a pas déjà participé */}
{/* {!participated && (
  <button className="button1" onClick={() => confirmParticipation(selectedEvent.id, idUser)}>
    <FontAwesomeIcon icon={faSignInAlt} /> Participer
  </button>
)} */}
{/* Afficher un message si l'utilisateur a déjà participé */}
{/* {participated && (
  <div className="button-disabled">
    <button className="button1" disabled>
      <FontAwesomeIcon icon={faSignInAlt} /> Participer
    </button>
    <p className="already-participated-message">Vous avez déjà participé à cet événement</p>
  </div>
)} */}

{/* <button onClick={() => window.open(selectedEvent.lien, '_blank')} className="btn btn-primary">
      Inscrivez-vous ici</button> */}


    <div style={{ textAlign: 'center', padding: '20px 0 0', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
       <button onClick={() => {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        window.open(selectedEvent.lien, '_blank');
      }
    }} className="btn btn-primary">
      Inscrivez-vous ici
    </button>
    </div>


          <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} className="close-btn" />
        </Modal>
      )}
</Container>
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



export default connect(mapStateToProps)(ParticipateEvent);

