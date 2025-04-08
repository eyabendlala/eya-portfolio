import React, {useState}  from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot,faImage,faRectangleList, faVenusMars,faUserTie,faLocationArrow,faLocationCrosshairs,faParagraph,faListCheck,faGlobe,faDownLeftAndUpRightToCenter,faBusinessTime,faMoneyBill,faHeading} from '@fortawesome/free-solid-svg-icons';
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import {Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer  } from 'react-leaflet';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import './CategoriePopup';
import CategoriePopup from './CategoriePopup';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate,Navigate } from 'react-router-dom';
// import MapPicker from 'react-google-map-picker'
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';

import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import './PublierEmploi.css';
import { notifyUser } from './Notification'; 
import { handlePublierEmploiClick } from './Notification'; 
import LoadingSpinner from './LoadingSpinner'; // Replace './LoadingSpinner' with the actual path to your LoadingSpinner component


const DefaultLocation = { lat: 10, lng: 106};
const DefaultZoom = 10;

function SelectedCategory({ category, onRemove }) {
  return (
    <div className="category-box">
      <span>{category}</span>
      <IconButton onClick={() => onRemove(category)}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}

// const baseURL='http://127.0.0.1:8000'


const PublierEmploi = (props) => {


 
  const [categorySelected, setCategorySelected] = useState(false);
  const [image_emploi, setImageEmploi] = useState();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageEmploi(file); // Set the selected file to the state using setImageEmploi
  };
  //console.log(image_emploi);



  const [error, setError] = useState('');
  const [modalVisible,setModalVisible]=useState(false);
  const [emplois, setEmplois]=useState([]);

  const [duree, setDuree] = useState({
    value: '',
    unit: 'mois', // Default unit
  });

  const handleDureeChange = (event) => {
    const { name, value } = event.target;
    setDuree((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [montant, setMontant] = useState({
    value: '',
    unit: 'heure', // Default unit
  });

  const handleMontantChange = (event) => {
    const { name, value } = event.target;
    setMontant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  

//console.log("hi nour",id.id);
  const creerEmploi = async (event) => {
    event.preventDefault();
    const url = `/emploi/`;
    const ageRangeString= ageRange.toString();
   
    try {
      const response = await fetch(url,
        {
          body: JSON.stringify({
            
           titre,
           description,
           date_postulation,
           date_expiration,
           duree_offre,
           genre_demande,
           intervalle_age: ageRangeString,
           localisation,
           montant_paiement,
           image_emploi,
           experience,
           region,
           type_emploi,
           user:props.id,
          categories: [1],
          idEmploi:90
           
           
            
          }),
          headers: {
            "Content-Type": "application/json", 
          },
          method: 'POST',
        
      });
     
  
      if (response.ok) {
        const data = await response.json();
        //console.log(data);
      

      } else {
        
        //console.log('Failed Network Request');
        //console.log('Response Status:', response.status);
        const errorData = await response.json();
        //console.log('Error Data:', errorData);
      }
    } catch (error) {
     // console.error('Error:', error);
    }
    // console.log(titre)
    // console.log(description)
    // console.log(date_postulation)
    // console.log(date_expiration)
    //  console.log(duree_offre)
    //  console.log(genre_demande)
    //  console.log(intervalle_age)
    //  console.log(localisation)
    //  console.log(montant_paiement)
    //  console.log(image_emploi)
    //  console.log(experience)
    //   console.log(region)
    //    console.log(type_emploi)
     
       setModalVisible(false)

       getAllEmplois()
    
  };
  const navigate = useNavigate();
  const getAllEmplois= async() =>
  {
    const response= await fetch(`/emploi/`)
    const data= await response.json()
    if(response.ok)
    {
      //console.log(data)
      setEmplois(data)
    }else{
      alert("Failed Network Request")
    }
  }
  const getEmplois=async() => {
    return axios.get('/emploi/')
    .then(res =>{
      return res.data})
  }
  const [formValues, setFormValues] = useState(new FormData());
  const [categories, setCategories] = useState([]);


const addEmplois = async () => {
  try {
    const formdata = new FormData();
    formdata.append('titre', titre);
    formdata.append('date_postulation', date_postulation);
    formdata.append('description', description);
    formdata.append('date_expiration', date_expiration);
    formdata.append('duree_offre', `${duree.value} ${duree.unit}`);
    formdata.append('genre_demande', genre_demande);
    formdata.append('intervalle_age', ageRange.toString());
    formdata.append('localisation', localisation);
    formdata.append('montant_paiement', `${montant.value}Dt/ ${montant.unit}`);
    formdata.append('image_emploi', image_emploi);
    formdata.append('experience', experience);
    formdata.append('region', region);
    formdata.append('type_emploi', type_emploi);
    formdata.append('user_id', props.id);

    selectedCategories.forEach((categoryId) => {
      formdata.append('categories', categoryId);
    });
   
      for (let pair of formdata.entries()) {
         console.log(pair[0] + ', ' + pair[1]);
        }
    const response = await axios.post("/post-emploi", formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Include other headers if needed (e.g., authorization)
      },
    });

   /*let emplois ={
    'titre':titre,
    'date_postulation':date_postulation,
    'description':description,
  
    'date_expiration':date_expiration,
    'duree_offre': `${duree.value} ${duree.unit}`,
    'genre_demande':genre_demande,
    'intervalle_age':ageRange.toString(),
    'localisation':localisation,
    'montant_paiement': `${montant.value}Dt/ ${montant.unit}`,
    'image_emploi':image_emploi,
    'experience':experience,
    'region':region,
    'type_emploi':type_emploi,
    'user_id': props.id ,
    'categories':selectedCategories
   }

   console.log(emplois);



    try {
      const response = await axios.post("/post-emploi", emplois);*/
      
      if (response.status === 201) {
        toast.success('🦄 Votre poste est crée avec succés veuillez attendre la confirmation de l\'administrateur', {
          // position: "top-center",
          // autoClose: 2000,
          // hideProgressBar: false,
          // closeOnClick: true,
          // pauseOnHover: true,
          // draggable: true,
          // progress: undefined,
          // theme: "colored",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000
        });
        navigate('/')
      } else {
        
        setError("Une erreur s'est produite lors de la création de l'emploi")
      }
    } catch (error) {
     // console.log("hey erreur",error);
      
      setError("Une erreur s'est produite lors de la création de l'emploi")
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Already submitting, don't proceed.
    }

    setIsSubmitting(true);

    // Log the data you're trying to post
    // console.log("Data to be posted:", e.target);

    addEmplois(e.target)
      .then(res => {
        setEmplois(res);
        // Display a success message, and if needed, reset the form.
      })
      .catch(error => {
       // console.error("Error:", error);
        // Handle any errors and provide user feedback.
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable the button
      });
  };
useEffect(() => {
   const fetchCategories = async () => {
       try {
           const response = await axios.get("/get-categories");
           setCategories(response.data);
           //console.log(response.data);
       } catch (error) {
           //console.log(error);
          }
        };
    
        fetchCategories();
      }, [props]);
 
   useEffect(
    ()=> {
      let mount =true 
      getEmplois()
      .then(res => {//console.log("res from api",res)
      setEmplois(res)
      return()=> mount =false
    })
    },[]
   )

  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  function handleChangeLocation (lat, lng){
    setLocation({lat:lat, lng:lng});
  }
  
  function handleChangeZoom (newZoom){
    setZoom(newZoom);
  }

  function handleResetLocation(){
    setDefaultLocation({ ... DefaultLocation});
    setZoom(DefaultZoom);
  }

  const options = [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Zaghouan',
    'Bizerte',
    'Béja',
    'Jendouba', 
    'Kef',
    'Siliana',
    'Kairouan',
    'Sousse',
    'Monastir',
    'Mahdia',
    'Sfax',
    'Kasserine',
    'Sidi Bouzid',
    'Gabès',
    'Medenine',
    'Tataouine',
    'Gafsa',
    'Tozeur',
    'Kebili'
  ];
  const type_emploi_options=[
    'Court',
    'Moyen',
    'Durable'
  ];
  const genre_prefere=[
    'Sans importance',
    'Homme',
    'Femme'
 ];

  const [min, setMin] = useState(18);
  const [max, setMax] = useState(65);

  const ageRangeDisplay = `\$max - \$min`;

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [date_postulation, setDatePostulation] = useState('');
  const [date_expiration, setDateExpiration] = useState('');
  const [duree_offre, setDureeOffre] = useState('');
  const [genre_demande, setGenreDemande] = useState(genre_prefere[0]);
  const [intervalle_age, setIntervalleAge] = useState([min, max]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [localisation, setLocalisation] = useState('');
  
  const [montant_paiement, setMontantPaiement] = useState('');
  const [experience, setExperience] = useState('');
  const [region, setRegion] = useState(options[0]);
  const [type_emploi, setTypeEmploi] = useState(type_emploi_options[0]);
  const locationC = useLocation();
  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const query = new URLSearchParams(locationC.search);
  const showCategorieModalQueryParam = query.get('showCategorieModal');

    useEffect(() => {
      setShowCategorieModal(showCategorieModalQueryParam === 'true');
    }, [showCategorieModalQueryParam]);


    const handleOpenCategorieModal = () => {
      setShowCategorieModal(true);
    };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
    setDatePostulation(formattedDate);
  }, []);

 

 
const ageRange = `${min} - ${max}`;


const [formData, setFormData] = useState(new FormData());

const buildFormData  = () => {
  const formValues = new FormData();

  
  formValues.append('titre',titre);
  formValues.append('description',description);
  formValues.append('date_postulation',date_postulation);
  formValues.append('date_expiration',date_expiration);
  formValues.append('duree_offre',duree_offre);
  formValues.append('genre_demande',genre_demande);
  formValues.append('intervalle_age',ageRange.toString());
  formValues.append('localisation',localisation);
  formValues.append('montant_paiement',montant_paiement);
 formValues.append('image_emploi',image_emploi);
  formValues.append('experience',experience);
  formValues.append('region',region);
  formValues.append('type_emploi',type_emploi);
  formValues.append('user',props);
  formValues.append('categories' ,[1]);

  return formValues; 
  
}

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleCategoriesSelect = (categorieId) => {
  //   if (selectedCategories.includes(categorieId)) {
  //     setSelectedCategories(selectedCategories.filter((id) => id !== categorieId));
  //   } else {
  //     setSelectedCategories([...selectedCategories, categorieId]);
  //   }
  // };

  const handleCategoriesSelect = (event, categoryId) => {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      setSelectedCategories([...selectedCategories, categoryId]);
      setCategorySelected(true);

    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
      setCategorySelected(selectedCategories.length - 1 > 0);

    }
  };
  
 
 
  const handleCloseCategoriesModal = () => {
    navigate(`/publier-emploi`);
  };


  

 
 

   const handleInputClick = () => {
    // Make input editable on click
    setEditable(true);
  }
  
  const handleInputChange = (event) => {
    // Update selected categories from input value
    setSelectedCategories(event.target.value.split(', ')); 
  }
  const [editable, setEditable] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const handleSelect = (event) => {
    const category = event.target.value;
  
    // Only add category if not already selected
    if(!selectedCategories.includes(category)) {
      setSelectedCategories(prev => [...prev, category]);
    }
  }
  const handleRemove = (category) => {
    setSelectedCategories(prev => 
      prev.filter(c => c !== category)
    );
  }
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
 
 if (!props.isAuthenticated) {
    return <Navigate to="/login" />;
  } 

  return (
    <div className="site-wrap">
      <Navbar></Navbar>
      <ToastContainer
        // position="top-center"
        // autoClose={2000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="colored"
      />
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-white font-weight-bold">Créer un poste</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Publier Emploi</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section text-center d-flex justify-content-center align-items-center">
          
          <div className="container">
            <div className="row">
              <div className="col-md-12">

                <form method="post" className="signup-form" encType="multipart/form-data" onSubmit={handleAddSubmit} >
                  
                  <div className="form-wrapper">
                      <h2 className="bread-title">Publier Une Offre</h2>
                  </div>
                  <p className="error-message">{error}</p>
                  <div className="row form-group" >

                    <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black"  htmlFor="titre" style={{marginLeft:'-180px'}}>
                          <span className="labelspan">Titre de l'offre:</span>
                        </label>
                        <input type="text" id="titre" name="Titre" className="form-control input-select" placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required/>
                        <FontAwesomeIcon icon={faHeading} className='iconlogin'/>
                    </div>

                    <div className="col-md-6 mt-3 mt-md-0">
                    <label className="text-black" htmlFor="type_emploi" style={{marginLeft:'-180px'}}> 
                          <span className="labelspan">Type d'emploi:</span>
                        </label>
                        
                        <select className="form-control input-select" value={type_emploi} onChange={(e) => setTypeEmploi(e.target.value)}>
                        {type_emploi_options.map(type_emploi_options => (
                            <option key={type_emploi_options} value={type_emploi_options}>
                                 {type_emploi_options}
                            </option>
                                  ))}
                      </select>
                        <FontAwesomeIcon icon={faUserTie} className='iconlogin' />
      </div>
  
                  </div> 
                  <div className="row form-group" >
                    <div className="col-md-6 mt-3 mt-md-0">
                      <label className="text-black" htmlFor="date_expiration" style={{marginLeft:'-180px'}}>  
                        <span className="labelspan">Date d'expiration:</span>
                      </label>
                      <input type="date" id="date_expiration" className="form-control input-select" value={date_expiration} onChange={(e) => setDateExpiration(e.target.value)} required/>
                    </div>
                    
                    <div className="col-md-6 form-group">
                        <label htmlFor="duree" style={{marginLeft:'-180px'}}><span className="labelspan">Durée de l'offre</span></label>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            className="form-control input-select"
                            id="duree"
                            name="value"
                            value={duree.value}
                            onChange={handleDureeChange}
                          />
                          <select
                             className="form-control input-select" 
                            name="unit"
                            value={duree.unit}
                            onChange={handleDureeChange}
                          >
                            <option value="jours">Jours</option>
                            <option value="mois">Mois</option>
                            <option value="ans">Ans</option>
                          </select>
                        </div>
                      </div>
                  </div> 

              <div className="row form-group" >
                      <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="genre_demande" style={{marginLeft:'-180px'}}> 
                          <span className="labelspan">Genre de demande:</span>
                        </label>
                    
                        <select type="text" id="genre_demande" className="form-control input-select" value={genre_demande} onChange={(e) => setGenreDemande(e.target.value)}>
                        {genre_prefere.map(genre_prefere => (
                            <option key={genre_prefere} value={genre_prefere}>
                                 {genre_prefere}
                            </option>
                                  ))}
                      </select>
                        
                        <FontAwesomeIcon icon={faVenusMars} className='iconlogin' />
                      </div>

                      <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="intervalle_age" style={{marginLeft:'-180px'}}> 
                           <span className="labelspan">Intervalle d'âge:</span>
                        </label> <br/>
                        <input               
        type="range"
        min="18"
        max="65" 
        value={min}
        onChange={(e) => setMin(e.target.valueAsNumber)} 
      />
      <input 
        type="range" 
        min="18" 
        max="65"
        value={max}
        onChange={(e) => setMax(e.target.value)} 
      />
      <p>
      {min} - {max}
      </p>
                      </div>
              </div> 

              <div className="row form-group" >

                  <div className="col-md-6 mt-3 mt-md-0">
                      <label className="text-black" htmlFor="localisation" style={{ marginLeft: '-180px' }}>
                          <span className="labelspan">Localisation:</span>
                      </label>
                      <input type="text" name="localisation" value={localisation} className="form-control input-select" placeholder="42, Avenue des Licornes 9876 Cité Enchantée Tunisie"  onChange={(e) => setLocalisation(e.target.value)}  required />
                      <FontAwesomeIcon icon={faLocationArrow} className='iconlogin' />
                 </div>

                 <div className="col-md-6 form-group">
                        <label htmlFor="montnant" style={{marginLeft:'-180px'}}><span className="labelspan">Montant de paiement:</span></label>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            className="form-control input-select"
                            id="montnat"
                            name="value"
                            value={montant.value}
                            onChange={handleMontantChange}
                          />
                          <FontAwesomeIcon icon={faMoneyBill} className='iconlogin' style={{marginTop:'2px'}} />
                          <select
                             className="form-control input-select" 
                            name="unit"
                            value={montant.unit}
                            onChange={handleMontantChange}
                          >
                            <option value="heure ">Heure</option>
                            <option value="jours ">Jour</option>
                            <option value="mois ">Mois</option>
                            
                          </select>
                        </div>
                      </div>

                  </div> 
              <div className="row form-group" >

                    <div className="col-md-6 mt-3 mt-md-0">
                      <label className="text-black" htmlFor="experience" style={{marginLeft:'-180px'}}> 
                        <span className="labelspan">Expérience:</span>
                      </label>
                      <input type="text" id="experience" className="form-control input-select" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="1+ ans d'expérience"/>
                      <FontAwesomeIcon icon={faListCheck} className='iconlogin'/>
                    </div>

                    <div className="col-md-6 mt-3 mt-md-0">
                      <label className="text-black" htmlFor="region" style={{marginLeft:'-180px'}}> 
                         <span className="labelspan">Région:</span>
                      </label>
                      
                      <select className="form-control input-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                        {options.map(option => (
                            <option key={option} value={option}>
                                 {option}
                            </option>
                                  ))}
                      </select>
                      <FontAwesomeIcon icon={faLocationCrosshairs} className='iconlogin'/>
                    </div>

              </div> 

              <div className="row form-group" >
                    <div className="col-md-6 mt-3 mt-md-0">
                    <label className="text-black" htmlFor="description" style={{ marginLeft: '-180px' }}>
                         <span className="labelspan">Description:</span>
                    </label>
                   <div  className="quill-container" style={{ border: '2px solid #06A9F1', borderRadius: '24px', height: '89px', overflow: 'auto' }}>
                   <div className="description-text" style={{ textAlign: 'justify' }}>
                         <ReactQuill
                             value={description}
                            onChange={setDescription}
                            required
                         /> 
                   </div>
                  </div>  
                    </div>

                    <div className="col-md-6 mt-3 mt-md-0">
                      <label className="text-black" htmlFor="image_emploi" style={{marginLeft:'-180px'}}> 
                        <span className="labelspan">Image d'emploi:</span>
                      </label><br />
                      <input
                         type="file"
                         
                         accept="image/*"
                         name="image_emploi"
                         onChange={handleImageChange}
                         className="upload-box"
                         required
                      />
                      </div>

                     <div className="form-group">
      <label className="text-black" htmlFor="categories">
        <span className="labelspan">Catégories d'offre d'emploi:</span>
      </label>
      <br />

      <Button onClick={openModal} className="custom-button" 
      style={{ borderRadius: '25px' }}
      >Sélectionnez une ou <br/>
      plusieurs catégories</Button>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header >
          <Modal.Title>Categories</Modal.Title>
          <Button variant="outline-primary" onClick={closeModal}>
    Fermer
  </Button>
        </Modal.Header>
        <Modal.Body>
          {categories && Array.isArray(categories) ? (
            <div className="categories-container">
              {categories.map((categorie) => (
                <div className="categorie-box" key={categorie.id}>
                  <label>
                    <input
                      type="checkbox"
                      value={categorie.id}
                      checked={selectedCategories.includes(categorie.id)}
                      onChange={(e) => handleCategoriesSelect(e, categorie.id)}
                    />
                    {categorie.nom}
                    {selectedCategories.includes(categorie.id) && (
                      <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {!categorySelected && selectedCategories.length === 0 && (
  <div className="error-message">Veuillez sélectionner au moins une catégorie.</div>
)}

    </div>    
               </div>
                    <div className="row form-group" style={{marginLeft:'200px'}}>
                       <div className="col-md-12" >
                          <input type="submit" className="btn btn-primary btn-block btn-lg" value="Poster l'emploi" disabled={isSubmitting}/>
                          {isSubmitting && <LoadingSpinner />}
                       </div>
                    </div>
                </form>
              </div>
            </div>
          </div>
      </section>
    </div>  
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  role: state.auth.user && state.auth.user.role,
  id: state.auth.user && state.auth.user.id, 
 
});
export default connect(mapStateToProps)(PublierEmploi);