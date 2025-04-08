import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useNavigate, useParams, Navigate } from 'react-router-dom';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import Navbar from '../../components/Navbar';
import RecruiterNavbar from '../../components/RecruiterNavbar';
import { Modal, Button, Form } from 'react-bootstrap';
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";


// export const baseURL = 'http://127.0.0.1:8000';


const validateURL = (url) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 
    'i'
  );
  return !!urlPattern.test(url);
};


const UpdateEvent = () => {
  const { eventId } = useParams(); 
  const navigate = useNavigate();
  const [image, setImage] = useState();


  const [showModal, setShowModal] = useState(false);
  const [secteurs, setSecteurs] = useState([]);
  const [selectedSecteurs, setSelectedSecteurs] = useState([]);
  const [priceOption, setPriceOption] = useState('Sans Frais'); 



  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    price: '',
    image: '',
    description_event: '',
    date_expiration: '',
    lien: '',
    secteur: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    date: '',
    location: '',
    price: '',
    description_event: '',
    date_expiration: '',
    lien: '',
    secteur: ''
  });
  

  const [touched, setTouched] = useState({
    title: false,
    date: false,
    location: false,
    price: false,
    description_event: false,
    date_expiration: false,
    lien: false,
    secteur: false
  });

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleQuillBlur = () => {
    setTouched({ ...touched, description_event: true });
    };

  const handleOpenModal = () => {
    setShowModal(true);
    setTouched({...touched, secteur: true}); 
  };

   const handleCloseModal = () => {
  setShowModal(false);
   };

  useEffect(() => {
    const newErrors = { ...errors }; 
    newErrors.title = formData.title.length >= 5 ? '' : 'Le titre doit contenir au moins 5 caractères.';
    const currentDate = new Date();
    const eventDate = new Date(formData.date);
    newErrors.date = eventDate && eventDate > currentDate ? '' : 'La date de l’événement doit être dans le futur.';
    newErrors.location = formData.location ? '' : 'Le lieu est obligatoire.';
    newErrors.price = formData.price >= 0 ? '' : 'Le prix ne peut pas être négatif.';
    newErrors.description_event = formData.description_event.length > 0 ? '' : 'La description ne peut pas être vide.';
    const expirationDate = new Date(formData.date_expiration);
    newErrors.date_expiration = expirationDate && eventDate && expirationDate > eventDate ? '' : 'La date d\'expiration doit être après la date de l’événement.';
    newErrors.secteur = selectedSecteurs.length > 0 ? '' : 'Au moins un secteur doit être sélectionné.';
    newErrors.lien = touched.lien && !validateURL(formData.lien) ? 'Veuillez entrer une URL valide pour le Google Form.' : '';

    setErrors(newErrors); 
  }, [formData, selectedSecteurs]);


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/get-event/${eventId}/`);
        const eventData = response.data;
  
        // Reformater les dates au format accepté par input type="datetime-local"
        const formattedEventData = {
          ...eventData,
          image: eventData.image, 

          date: eventData.date.split('T')[0] + 'T' + eventData.date.split('T')[1].slice(0, 5),
          date_expiration: eventData.date_expiration.split('T')[0] + 'T' + eventData.date_expiration.split('T')[1].slice(0, 5)
        };
  
        setFormData(formattedEventData);
        
           // Ici, on ajuste l'état basé sur le prix de l'événement.
           if (eventData.price === '0' || eventData.price === '0.00') {
            setPriceOption('Sans Frais');
            // Assurez-vous d'initialiser formData.price à '0' également pour garder les informations cohérentes.
            setFormData({...formattedEventData, price: "0"});
          } else {
            setPriceOption('Avec Frais');
            setFormData(formattedEventData);
          }

        setSelectedSecteurs(eventData.secteur || []); 
        console.log('Secteur IDs for the event:', eventData.secteur); 

      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
  
    fetchEvent();
  }, [eventId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value); 
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setFormData(previousFormData => ({ 
        ...previousFormData, 
        description_event: value 
    }));
};
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  setFormData({ ...formData, image: file });
};


useEffect(() => {
  axios.get('/secteurs/')  
    .then(response => {
      setSecteurs(response.data);  
      console.log('Secteurs récupérés:', response.data);  
    })
    .catch(error => {
      console.log('Erreur lors de la récupération des secteurs:', error);  
    });
}, []);


const handleSelectSecteur = (secteurId) => {
  const isSelected = selectedSecteurs.includes(secteurId);
  const newSelectedSecteurs = isSelected
      ? selectedSecteurs.filter(id => id !== secteurId)
      : [...selectedSecteurs, secteurId];

  console.log(`Updating selected sectors:`, newSelectedSecteurs); 
  setSelectedSecteurs(newSelectedSecteurs);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const areThereErrors = Object.values(errors).some(error => error);

  if (areThereErrors) {
    toast.error('Veuillez corriger les erreurs avant de soumettre.', {
      position: "top-right", 
      toastId: 'unique-error'  
    });    return;
  }

  const dataToSubmit = new FormData();

  // Ajoutez tous les champs de formData à dataToSubmit
  Object.keys(formData).forEach(key => {
    dataToSubmit.append(key, formData[key]);
  });

  // Ajoutez l'image seulement si une nouvelle a été sélectionnée
  if (image) {
    dataToSubmit.append('image', image);
  }

  // Ajoutez les identifiants des secteurs sélectionnés
  selectedSecteurs.forEach(id => dataToSubmit.append('secteur_ids', id));

  try {
    const response = await axios.put(`/update-event/${eventId}/`, dataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Response data:', response.data);
    toast.success('Événement mis à jour avec succès !', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000 
    });
    navigate('/event-list/');
  } catch (error) {
    console.error('Error updating event:', error);
    toast.error('Erreur lors de la mise à jour de l\'événement');
  }
};
  return (
    <div className="site-wrap">
      <Navbar />
      <ToastContainer  />
      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: `url(${backgroundImg})` }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Modifier un Evénement</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Modifier Event</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecruiterNavbar />
      <div className="event-page-container ">
      {/* <div className="gestion-event-sidebarr">
          <NavLink to="/recruteur/gestion-event/list" activeClassName="active">Liste des Événements</NavLink>
          <NavLink to="/recruteur/gestion-event/ajout" activeClassName="active">Ajout d'un Événement</NavLink>
        </div> */}
      <section className="site-section text-center d-flex justify-content-center align-items-center">
        <div className="event-form-container">
          <h2>Modifier un événement</h2>

          <form className="signup-form" encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="title">Titre:</label>
                  <input type="text" id="title" className="form-control input-select" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} />
                  {touched.title && errors.title && <div className="error-message">{errors.title}</div>}

                </div>
                <div className="form-group">
                  <label htmlFor="date">Date:</label>
                  <input type="datetime-local" id="date" className="form-control input-select" name="date" value={formData.date} onChange={handleChange} onBlur={handleBlur} />
                  {touched.date && errors.date && <div className="error-message">{errors.date}</div>}

                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="location">Lieu:</label>
                  <input type="text" id="location" className="form-control input-select" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} />
                  {touched.location && errors.location && <div className="error-message">{errors.location}</div>}

                </div>

                <div className="form-group">
                <label htmlFor="date_expiration">Date d'expiration:</label>
                <input type="datetime-local" id="date_expiration" className="form-control input-select" name="date_expiration" value={formData.date_expiration} onChange={handleChange} onBlur={handleBlur}  />
                {touched.date_expiration && errors.date_expiration && <div className="error-message">{errors.date_expiration}</div>}

              </div>
              </div>
            </div>

            <div className="row">
            <div className="col-md-6 mt-3 mt-md-0">
            <label htmlFor="lien">Lien d'inscription (Google Form) :</label>
             <input
               type="url"
               id="lien"
               className="form-control input-select"
               name="lien"
              value={formData.lien}
              onChange={handleChange}
              onBlur={handleBlur} 
             />
             {touched.lien && errors.lien && <div className="error-message">{errors.lien}</div>}
             </div>
              
            <div className="col-md-6 mt-3 mt-md-0">
  <div className="form-group">
    <label>Prix:</label>
    <select 
      className="form-control input-select mb-3" 
      value={priceOption} 
      onChange={(e) => {
        setPriceOption(e.target.value); 
        setFormData({ ...formData, price: e.target.value === 'Sans Frais' ? '0' : formData.price }); // Met à jour le prix à 0 si "Sans Frais" est sélectionné
      }}
    >
      <option value="Sans Frais">Sans Frais</option>
      <option value="Avec Frais">Avec Frais</option>
    </select>
    {priceOption === 'Avec Frais' && (
      <input 
        type="number" 
        id="price" 
        className="form-control input-select" 
        name="price" 
        value={formData.price} 
        onChange={handleChange} 
        onBlur={handleBlur} 
        min="0" 
      />
    )}
    {touched.price && errors.price && <div className="error-message">{errors.price}</div>}
  </div>
</div>
            
<div className="col-md-6 mt-3 mt-md-0">
  <div>
    <div>
      <label htmlFor="description_event" className="form-label">Description de l'événement:</label>
      <ReactQuill 
          id="description_event" 
          theme="snow"
          value={formData.description_event} 
          onChange={handleQuillChange}
          onBlur={handleQuillBlur}
          className="react-quill-container" 
      />
    </div>
  </div>
  {touched.description_event && errors.description_event && <div className="error-message">{errors.description_event}</div>}
</div> 

                <div className="col-md-6 mt-3 mt-md-4">
       <Button variant="primary" onClick={handleOpenModal} className="custom-button" 
      style={{ borderRadius: '25px' }}>
        Sélectionner des Secteurs
      </Button>
      {touched.secteur && errors.secteur && <div className="error-message">{errors.secteur}</div>}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>Sélectionnez des Secteurs</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', flexWrap: 'wrap' }}>
          {secteurs.map(secteur => (
            <div key={secteur.id} style={{ width: '50%', boxSizing: 'border-box', padding: '5px' }}>
      <label className="categorie-box" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          value={secteur.id}
          checked={selectedSecteurs.includes(secteur.id)}
          onChange={() => handleSelectSecteur(secteur.id)}
        />
        {secteur.nom}
      </label>
    </div>
  ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>

            Fermer
          </Button>
        </Modal.Footer>
      </Modal> 
              </div>  


            </div>

            <div className="row align-items-center">
            {/* Afficher l'image actuelle si disponible */}
            {!image && formData.image && (
          <div className="col-md-6">
            <div className="form-group">
              <label>Image Actuelle :</label>
              <br />
              {/* Utilisez l'URL complète si nécessaire ou ajustez en fonction de la structure de vos données */}
             {/* <img src={`http://127.0.0.1:8000${formData.image}`} alt="Event" style={{ maxWidth: '200px' }} /> */}
             <img src={formData.image} alt="Event" style={{ maxWidth: '200px' }} />

           </div>
          </div>
           )}

          {/* Champ pour télécharger une nouvelle image */}
          <div className="col-md-6">
          <div className="form-group">
          <label className="text-black" htmlFor="image">
          <span className="labelspan">Nouvelle Image </span>
          </label><br />
            <input
             type="file"
             accept="image/*"
             name="image"
             className="upload-box"
             onChange={handleImageChange}
             />
           </div>
        </div>
     </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg d-block mx-auto" 
            style={{ borderRadius: '25px', width: '600px' ,padding: '12px 20px' }} 
            >
              Modifier
            </button>

          </form>
        </div>
        
      </section>
    </div>
    </div>

  );
};

export default UpdateEvent;
