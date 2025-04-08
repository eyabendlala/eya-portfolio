import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEvent.css';
import { connect } from 'react-redux';
import { useNavigate,Navigate } from 'react-router-dom';
import AdminLayout from '../hocs/AdminLayout';
import { Row, Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Modal} from 'react-bootstrap';
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
function AddEvent({ isAuthenticated, user, role, id }){

    const [formData, setFormData] = useState({
      title: '',
      date: '',
      location: '',
      price: '',
      image: '',
      set_reminder: false,
      description_event: '', 
      date_expiration: '', 
      lien: '', 
      secteur: '' 
    });
    const navigate = useNavigate();
    const [idUser, setIdUser] = useState('');
    const [image, setImage] = useState();


    const [showModal, setShowModal] = useState(false);
    const [secteurs, setSecteurs] = useState([]);
    const [selectedSecteurs, setSelectedSecteurs] = useState([]);
    const [priceOption, setPriceOption] = useState('Sans Frais'); 

  
  
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
      setFormData({ ...formData, [name]: value });
    };
  
    const handleQuillChange = (value) => {
      setFormData({ ...formData, description_event: value });
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
    //   console.log('Image selected:', file); 
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
    if (isSelected) {
      setSelectedSecteurs(selectedSecteurs.filter(id => id !== secteurId));
    } else {
      setSelectedSecteurs([...selectedSecteurs, secteurId]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();



    const areThereErrors = Object.values(errors).some(error => error);

    if (areThereErrors) {
      toast.error('Veuillez corriger les erreurs avant de soumettre.');
      return;
    }


    try {
    //   console.log('Submitting form data...');
    //   console.log('Form data:', formData); 
    //   console.log('ID user:', idUser); 
  
      // Vérifier si idUser est défini
    if (idUser) {
      const formdata = new FormData();
      for (const key in formData) {
        formdata.append(key, formData[key]);
      }

     // Ajout de 'price' avec la valeur correcte basée sur l'option choisie
     const priceValue = priceOption === 'Sans Frais' ? "0.00" : formData.price;
     formdata.append('price', priceValue);


      formdata.append('user_id', idUser);
        console.log('Selected Secteurs:', selectedSecteurs);
        selectedSecteurs.forEach(secteurId => {
          console.log('Appending selected secteurId:', secteurId);
          formdata.append('secteur_ids', secteurId);
        });
      // Vérifier s'il y a une image sélectionnée
      if (image) {
        formdata.append('image', image);
        console.log('Image added to form data:', image);
      } else {
        console.log('No image selected.');
      }

      const response = await axios.post(`/event-create/`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/EventList/');
    //   console.log('Response data:', response.data); 
    } else {
        console.error('ID user is not available.'); 
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  
  useEffect(() => {
    if (user && user.id) {
        setIdUser(user.id);
    }
}, [user]);

    return (
        <>
            <AdminLayout>
                <Row className="justify-content-md-center mt-5">
                    <Col md={12}>
                        <center><h3> Ajouter un évenement  </h3></center>
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
                                <Row className="align-items-center"> {/* ou align-items-start align-items-end */}

                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Image</Form.Label>
                                        <FormControl type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            name="image"
                                            className='mt-1'
                                            required
                                        />
                                        {image && (
                                            <img src={image} alt="Selected" className="mt-1" style={{ maxWidth: '100px' }} />
                                        )}
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

                            <Row className="mt-4">
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

  
const mapStateToProps = (state) => {

    return {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user, 
      role: state.auth.user && state.auth.user.role,
      id: state.auth.user && state.auth.user.id,
    };
  };


  export default connect(mapStateToProps)(AddEvent); 
