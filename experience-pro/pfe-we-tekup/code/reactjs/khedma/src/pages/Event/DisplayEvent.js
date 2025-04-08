import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DisplayEvent.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import Navbar from '../../components/Navbar';
import { NavLink,useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faMapMarkerAlt, faAlignLeft, faTag, faSitemap, faCircleXmark, faDollarSign, faCalendar  } from '@fortawesome/free-solid-svg-icons';
import RecruiterNavbar from '../../components/RecruiterNavbar';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';



// export const baseURL = 'http://127.0.0.1:8000';

const DisplayEvent = ({user}) => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user_id, setUser_id] = useState('');


//Filtred 
const [displayedEvents, setDisplayedEvents] = useState([]);
const [locationFilter, setLocationFilter] = useState('');
// const [priceFilter, setPriceFilter] = useState('');
const [sectorFilter, setSectorFilter] = useState('');
const [periodFilter, setPeriodFilter] = useState('');
const [sectors, setSectors] = useState([]);
const regions = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
  'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia',
  'Manouba', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
];
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


  const customProgressStyle = {
    background: '#1E90FF', 
  };
  
  const navigate = useNavigate();

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
        return true; 
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
};

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const updateEvent = (eventId) => {
    navigate(`/updateEvent/${eventId}`);
  };
  
  const deleteEvent = async (eventId) => {

     const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
     if (confirmDelete) {
      // console.log('Deleting event with ID:', eventId);
    try {
      const response = await axios.delete(`/delete-event/${eventId}/`);
      // console.log('Event deleted successfully');
      setEvents(events.filter(event => event.id !== eventId));

      toast.success('Événement supprimé avec succès !', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000         

      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  }
  };

  return(
    <div className="participate-event-wrapper">
    
        <Navbar></Navbar>
  
  <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-7">
          <h3 className="text-white font-weight-bold">Cherchez Votre Prochain Evénement! </h3>
          <div className="custom-breadcrumbs">
            <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
            <span className="text-white"><strong>Offres des Evenement Disponibles</strong></span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <RecruiterNavbar />

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

  <Container  className="mt-5">  
    {/* <div className="gestion-event-sidebar">
          <NavLink to="/recruteur/gestion-event/list" activeClassName="active">Liste des Événements</NavLink>
          <NavLink to="/recruteur/gestion-event/ajout" activeClassName="active">Ajout d'un Événement</NavLink>
        </div> */}
    <Row className="justify-content-center gx-2">
    {displayedEvents.map((event) => (
        <Col md={4} key={event.id} className="mb-4 px-5">

        <div className="postEventt-card">
          
          <div className="postEventt-card-content">

            <div className="postEventt-image">
            {/* <img src={`http://127.0.0.1:8000${event.image}`} alt="Event" /> */}
            <img src={event.image} alt="Event" />

            </div>
            <div className="postEventt-titre"> 
              <h2 className="titreEventt">{event.title}</h2> 
            </div>
            <div className="postEventt-localisation">
             <p className="localisation">
             <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'skyblue' }} /> Lieu:  {event.location}
           </p>
          </div>
            <div className="postEventt-localisation">
            <p className="localisation">
             <FontAwesomeIcon icon={faCalendar} className="mr-2" style={{ color: 'skyblue' }} />Date_début: {new Date(event.date).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            </div>
         
          <div className="postEventt-localisation">
            <p className="localisation">
            <FontAwesomeIcon icon={faSitemap} style={{ color: 'skyblue' }} /> Secteur: 
            {event.secteurs_noms && event.secteurs_noms.length > 0 ? event.secteurs_noms.join(', ') : ''}
            </p>
            </div>

            <div className="postEventt-expiration"> 
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
<ToastContainer

          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          progressStyle={customProgressStyle} 
          

          />
</Container>

    {selectedEvent && (
    <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Example Modall"
  className="custom-modal-event"
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
      minHeight: '60vh', 
      maxWidth: '50%', 
      maxHeight: '90%', 
      display: 'flex',
      flexDirection: 'column', 
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

<div className="modal-button-group">
     
        {user && user.id === selectedEvent.user && (
        <button className="button2" onClick={() => deleteEvent(selectedEvent.id)} style={{ width: '115px', margin: '10px 0' }}>Supprimer</button>
      )}

        {user && user.id === selectedEvent.user && (
        <button onClick={() => updateEvent(selectedEvent.id)} className="button2" style={{ width: '115px' }} title="Modifier">
            Modifier
          </button>
      )}
</div>

        {user && user.id !== selectedEvent.user && (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => window.open(selectedEvent.lien, '_blank')} className="btn btn-primary" >
        Inscrivez-vous ici
       </button>
      </div>

       )}
        <br />
        <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} className="close-btn" />

      </Modal>
      )}

    </div>
    
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  reduxRole: state.auth.user && state.auth.user.role,
  user: state.auth.user, 
  id: state.auth.user && state.auth.user.id,
});

export default connect(mapStateToProps)(DisplayEvent);
