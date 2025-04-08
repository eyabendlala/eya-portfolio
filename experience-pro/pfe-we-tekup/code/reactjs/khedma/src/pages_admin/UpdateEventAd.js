import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../hocs/AdminLayout';
import { Row, Col, Form, FormGroup, FormControl, Button, Modal } from 'react-bootstrap';
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


const UpdateEventAd = () => {
  const { eventId } = useParams(); // Récupérer l'ID de l'événement depuis l'URL
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

        setSelectedSecteurs(eventData.secteur || []); // Ajustez selon la clé correcte
        console.log('Secteur IDs for the event:', eventData.secteur); // Log les IDs récupérés
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
  
    fetchEvent();
  }, [eventId]);
  
// Controle Saisies
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
    // console.log('Image selected:', file); 
    setImage(file);
    // Mise à jour de formData avec l'image sélectionnée
    setFormData({ ...formData, image: file });
};



useEffect(() => {
  axios.get('/secteurs/')  
    .then(response => {
      setSecteurs(response.data);  // Mise à jour de l'état avec la liste des secteurs récupérés
      console.log('Secteurs récupérés:', response.data);  // Affichage dans la console
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

  // console.log(`Updating selected sectors:`, newSelectedSecteurs); 
  setSelectedSecteurs(newSelectedSecteurs);
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const areThereErrors = Object.values(errors).some(error => error);

    if (areThereErrors) {
      toast.error('Veuillez corriger les erreurs avant de soumettre.');
      return;
    }

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        dataToSubmit.append(key, formData[key]);
      }
    });
  
    // Ajoutez l'image uniquement si une nouvelle a été sélectionnée
    if (image) {
      dataToSubmit.append('image', image);
    }

    // Ajoutez les identifiants des secteurs sélectionnés
  selectedSecteurs.forEach(id => dataToSubmit.append('secteur_ids', id));

    try {
      
      // console.log('Submitting form data for update...');
      // console.log('Form data:', formData);
  
      const response = await axios.put(`/update-event/${eventId}/`, dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Response data:', response.data);
      toast.success('Événement mis à jour avec succès !', {
        position: toast.POSITION.TOP_RIGHT
      });
      navigate('/admin/EventList/');
      
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Erreur lors de la mise à jour de l\'événement');
    }
  };
  return (
    <>
        <AdminLayout>
            <Row className="justify-content-md-center mt-5">
                <Col md={12}>
                    <center><h3> Modifier un évenement  </h3></center>
                    <Form className="signup-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup className='mt-3'>
                                    <Form.Label style={{marginLeft: '20px'}}>Titre </Form.Label>
                                    <FormControl type="text"
                                        value={formData.title}                    
                                        name="title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className='mt-1'
                                        required
                                    />
                                 {touched.title && errors.title && <div className="error-message">{errors.title}</div>}
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Lien</Form.Label>
                                        <FormControl type="url"
                                          value={formData.lien} 
                                          name="lien"
                                          onChange={handleChange}
                                          onBlur={handleBlur} 
                                          className='mt-1'
                                          required
                                        />
                                           {touched.lien && errors.lien && <div className="error-message">{errors.lien}</div>}

                                    </FormGroup>
                                </Col>
                        </Row>



                        <Row>
                            <Col md={6}>
                                <FormGroup className='mt-3'>
                                    <Form.Label style={{marginLeft: '20px'}}>Localisation</Form.Label>
                                    <FormControl type="text"
                                        value={formData.location} 
                                        name="location"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className='mt-1'
                                        required
                                    />
                                {touched.location && errors.location && <div className="error-message">{errors.location}</div>}
                                </FormGroup>
                            </Col>
                         

                            <Col md={6}>
                             <FormGroup className='mt-3'>
                               <Form.Label style={{marginLeft: '20px'}}>Description</Form.Label>
                                 <ReactQuill
                                    value={formData.description_event}
                                    onChange={handleQuillChange}
                                    onBlur={handleQuillBlur}
                                    className='mt-1 react-quill-container'
                                    theme="snow"
                                />
                            {touched.description_event && errors.description_event && <div className="error-message">{errors.description_event}</div>}
                             </FormGroup>
                           </Col>
                        </Row>
                        <Row>
 
                           <Col md={6}>
                                <FormGroup className='mt-3'>
                                    <Form.Label style={{marginLeft: '20px'}}>Date</Form.Label>
                                    <FormControl type="datetime-local"
                                        value={formData.date} 
                                        name="date"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className='mt-1'
                                        required
                                    />
                                {touched.date && errors.date && <div className="error-message">{errors.date}</div>}

                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup className='mt-3'>
                                    <Form.Label style={{marginLeft: '20px'}}>Date d'expiration</Form.Label>
                                    <FormControl type="datetime-local"
                                        value={formData.date_expiration} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="date_expiration"
                                        className='mt-1'
                                        required
                                    />
                                {touched.date_expiration && errors.date_expiration && <div className="error-message">{errors.date_expiration}</div>}
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
 
</Row>


                        <Row>
                   
               {/* Champ pour télécharger une nouvelle image */}
  <Col md={6} className="mt-3">
    <FormGroup>
      <Form.Label>Nouvelle Image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        name="image"
        onChange={handleImageChange}
        className="mt-1"
      />
    </FormGroup>
  </Col>

                      <Col md={6}>
                             <FormGroup className='mt-3'>
                            <Form.Label style={{marginLeft: '20px'}}>Prix</Form.Label>
                           <Form.Select 
                              className="mt-1 mb-3" 
                              value={priceOption} 
                              onChange={(e) => {
                              setPriceOption(e.target.value); // Mise à jour de l'option sélectionnée
                              setFormData({ ...formData, price: e.target.value === 'Sans Frais' ? '0' : formData.price }); // Met à jour le prix à 0 si "Sans Frais" est sélectionné
                            }}
                         >
                         <option value="Sans Frais">Sans Frais</option>
                        <option value="Avec Frais">Avec Frais</option>
                          </Form.Select>

                       {priceOption === 'Avec Frais' && (
                         <FormControl 
                              type="number"
                              value={formData.price}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="price"
                              className='mt-1'
                              min="0"
                              required
                        />
                       )}
                     {touched.price && errors.price && <div className="error-message">{errors.price}</div>}
                    </FormGroup>
                     </Col>

                        </Row>

                     
                        <Row className="mt-4">
                       
                        {!image && formData.image && (
    <Col md={6} className="mt-3">
      <FormGroup>
        <Form.Label>Image Actuelle :</Form.Label>
        <div>
          {/* <img src={`http://127.0.0.1:8000${formData.image}`} alt="Event" style={{ width: 'auto', maxWidth: '200px', height: 'auto' }} /> */}
          <img src={formData.image} alt="Event" style={{ width: 'auto', maxWidth: '200px', height: 'auto' }} />

        </div>
      </FormGroup>
    </Col>
  )}

       <Col md={6} className="mt-3">

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
</Col>
  
                            <Col md={12} className="text-center">
                                <Button className="mt-4" variant="primary" type="submit" style={{borderRadius :'15px'}}>Submit</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </AdminLayout>
    </>
)
}
export default UpdateEventAd;
