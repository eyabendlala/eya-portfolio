import React, { useState, useEffect } from 'react';
import './Profile.css';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Navbar from '../../components/Navbar';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { faUser, faGear, faRightFromBracket, faStar, faLock, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getPersonneParId, load_user,geCompetencesByPerson,ajoutercompetenceuser,geAllCompetences,supprimercompetencecandidat } from '../../actions/auth';
import { modifierPersonne, reset_password_confirm } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate,Navigate } from 'react-router-dom';
import './CompetencePopup';
import CompetencePopup from './CompetencePopup';

const Profile = (props) => {
  
// Access the id prop
    const { id } = props;
    const { token } = props;
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [isCvChanged, setIsCvChanged] = useState(false);
    const [activeTab, setActiveTab] = useState('account-general');
    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [titreduprofil,setTitrduprofil]=useState('');
    const [adresse, setAdresse] = useState('');
    const [numero_telephone, setNumero_telephone] = useState('');
    const [role, setRole] = useState('candidat');
    const [nationalite, setNationalite] = useState('');
    const [prenom, setPrenom] = useState('');
    const [genre, setGenre] = useState('');
    const [date_naissance, setDate_naissance] = useState('');
    const [image, setImage] = useState('');
    const [oldpassword, setOldpassword]=useState('');
    const [newpassword, setNewPassword] = useState('');
    const [renewpassword, setReNewPassword] = useState('');
    const [cv,setCv]=useState('');
    const [previousImage,setPreviousImage]= useState('');
    const [competences, setCompetences] = useState([]);
    const [showCompetenceModal, setShowCompetenceModal] = useState(false);
    const [selectedCompetences, setSelectedCompetences] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const showCompetenceModalQueryParam = query.get('showCompetenceModal');
    const navigate = useNavigate();

    useEffect(() => {
      setShowCompetenceModal(showCompetenceModalQueryParam === 'true');
    }, [showCompetenceModalQueryParam]);


    const handleOpenCompetenceModal = () => {
      setShowCompetenceModal(true);
    };
    useEffect(() => {
      const fetchCompetences = async () => {
          try {
              const response = await geCompetencesByPerson(id);
              const data = response.data;
              setCompetences(data);
          } catch (error) {
              alert(error);
          }
      };

      fetchCompetences();
  }, [id]);
  
  
    const handleCloseCompetenceModal = () => {
      navigate(`/profile-utilisateur`);
    };
  
    const handleCompetenceSelect = (competenceId) => {
      if (selectedCompetences.includes(competenceId)) {
        setSelectedCompetences(selectedCompetences.filter((id) => id !== competenceId));
      } else {
        setSelectedCompetences([...selectedCompetences, competenceId]);
      }
    };
  
    const handleTabClick = (tabId) => {
      setActiveTab(tabId);
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getPersonneParId(id);
          const data = response.data;
          //console.log(data.personne);
          setNom(data.personne.nom);
          setImage(data.personne.image);
          setCv(data.personne.cv);
          setPrenom(data.personne.prenom);
          setTitrduprofil(data.personne.titreduprofil);
          setNationalite(data.user.nationalite);
          setAdresse(data.user.adresse);
          setNumero_telephone(data.user.numero_telephone);
          setEmail(data.user.email);
          setDate_naissance(data.personne.date_naissance);
          setGenre(data.personne.genre);
          setPreviousImage(data.personne.image);
        } catch (error) {
          alert(error);
        }
      };
  
      // Load user data only if id is available
      if (id) {
        props.loadUser(); // Dispatch the load_user action
        fetchData();
      }
    }, [id]);
    useEffect(() => {
      const fetchCompetences = async () => {
        try {
          const response = await geCompetencesByPerson(id);
          const data = response.data;
          setCompetences(data); // Set the fetched competences data to the state
        } catch (error) {
          alert(error);
        }
      };
    
      fetchCompetences();
    }, [id]); // Call the fetchCompetences function whenever the id changes
    

    const handleSubmitProfile = async (event) => {
      event.preventDefault();
      try {
        const formData = new FormData(event.target); // Access form data using event.target
        formData.append('email', email);
        formData.append('adresse', adresse);
        formData.append('numero_telephone', numero_telephone);
        formData.append('role', role);
        formData.append('titreduprofil',titreduprofil);
        formData.append('nationalite', nationalite);
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('genre', genre);
        formData.append('date_naissance', date_naissance);
        competences.forEach((competence, index) => {
          formData.append(`competences`, competence.id);
        });
    
        if (isImageChanged) {
          formData.append('image', image);
        }
        if (isCvChanged) {
          formData.append('cv', cv);
        }
        //console.log("previous",previousImage);
        //console.log("image",image);
        
        const response = await props.modifierPersonne(id, formData);
        if (response) {

          toast.success('🦄 Votre profile est modifié avec succés!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000 
          });

        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    };
    const handleImageChange = (e) => {
      const selectedFile = e.target.files[0];
  
      // Check if a new file is selected
      if (selectedFile) {
        setImage(selectedFile);
        setIsImageChanged(true); // Set the flag to indicate that a new image has been selected
      } else {
        setIsImageChanged(false); // Set the flag to indicate that no new image has been selected
      }
    };
    const handleCvChange = (e) => {
      const selectedFile = e.target.files[0];
  
      // Check if a new file is selected
      if (selectedFile) {
        setCv(selectedFile);
        setIsCvChanged(true); // Set the flag to indicate that a new image has been selected
      } else {
        setIsCvChanged(false); // Set the flag to indicate that no new image has been selected
      }
    };
    const handleDeleteCompetence = async (event, competenceId) => {
      event.preventDefault(); // Prevent the default button behavior
    
      try {
        const data = {
          user_id: id,
          competence_id: competenceId
        };
        //console.log("id user supprimé",id);
        //console.log("id of competence supprimé",competenceId);
        const response = await props.supprimercompetencecandidat(data);
    
        if (response) {
          // Update the competences state after deletion
          const updatedCompetences = competences.filter(
            (competence) => competence.id !== competenceId
          );
          setCompetences(updatedCompetences);
    
          //console.log("Compétence supprimée avec succès");
        }
      } catch (error) {
        console.error('Error deleting competence:', error);
      }
    };


    const handleModifierMotdepasse = async (event) => {
      event.preventDefault();
      try {
        if(newpassword !== renewpassword){
          alert("les 2 mots de passes sont incompatibles")
        }
        if( newpassword === renewpassword){
          const response = await axios.post(
            `/auth/passwordchange/${id}/`,
            { old_password: oldpassword, new_password: newpassword }, // Adjust the field name here
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
    
          if (response.status === 200) {
            // toast.success('🦄 Votre mot de passe est modifié avec succés!', {
            //   position: "top-center",
            //   autoClose: 5000,
            //   hideProgressBar: false,
            //   closeOnClick: true,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            // });

            toast.success('🦄 Votre mot de passe est modifié avec succés!', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000 
            });


            
            if (response.status === 400) {
              alert("Le mot de passe actuel est incorrect");
            }}
           else {
            console.error('Password update failed:', response.data);
          }
        }
      } catch (error) {
        console.error('Password update failed:', error);
      }
    };
    if (props.role==="societe"){
      return <Navigate to="/notfoundpage" />;

    }

  return (
    <div className="site-wrap">
      <Navbar></Navbar>
      
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Khedma.site</h1>
              <div className="custom-breadcrumbs">
                <span className="text-white"><strong>Vous cherchez des emplois à court, moyen et à long terme?Nous vous met en relation avec les meilleurs offres.</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container light-style flex-grow-1 container-p-y body">
        <h4 className="font-weight-bold py-3 mb-4">Mon Profile</h4>
        <div className="card overflow-hidden">
          <div className="row no-gutters row-bordered row-border-light">
            <div className="col-md-3 pt-0">
              <div className="list-group list-group-flush account-settings-links">
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-general' ? 'active' : ''}`} onClick={() => handleTabClick('account-general')}>
                  <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;Information Personnel
                </a>
        
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-change-password' ? 'active' : ''}`} onClick={() => handleTabClick('account-change-password')}>
                  <FontAwesomeIcon icon={faLock} /> &nbsp;&nbsp;Modifier mot de passe
                </a>
                {/* <a className={`list-group-item list-group-item-action ${activeTab === 'account-social-links' ? 'active' : ''}`} onClick={() => handleTabClick('account-social-links')}>
                  <FontAwesomeIcon icon={faCreditCard} /> &nbsp;&nbsp;Payement
                </a>
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-connections' ? 'active' : ''}`} onClick={() => handleTabClick('account-connections')}>
                  <FontAwesomeIcon icon={faGear} /> &nbsp;&nbsp;Paramétre
                </a> */}
              </div>
            </div>
            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'account-general' ? 'active show' : ''}`} id="account-general">
                    <form onSubmit={handleSubmitProfile} encType="multipart/form-data">
                        <div className="card-body media align-items-center">
                        <img src={image} alt="Profile" className="d-block ui-w-80" />
                            <div className="media-body ml-4">
                            <label>
                              choisir une image 
                            </label> <br/>
                            <input type="file" className="upload-box" accept="image/*"  onChange={handleImageChange} />
                            &nbsp;                      
                            </div>
                        </div>
                    <hr className="border-light m-0" />
                    <div className="card-body soustitres">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <h4 className="mb-2 ">Détail personnel</h4>
                        </div>
                        <hr className="border border-1" style={{color:"black"}}></hr>
                        <div className='row'>
                          <div className='form-group'>
                            &nbsp;&nbsp;<label htmlFor='titreduprofil'>Titre du profil</label>
                            &nbsp;&nbsp;<input type='text' className="form-control" id="titreduprofil" placeholder="Enter votre titre du profil" value={titreduprofil} onChange={(e) => setTitrduprofil(e.target.value)} />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                              <label htmlFor="fullName">Nom</label>
                              <input type="text" className="form-control" id="nom" placeholder="Enter votre nom" value={nom} onChange={(e) => setNom(e.target.value)} />

                            </div>
                          </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label htmlFor="eMail">Prénom</label>
                            <input type="text" className="form-control" id="prénom" placeholder="Enter votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label htmlFor="phone">Genre</label>
                            <input type="text" className="form-control" id="genre" placeholder="Enter votre genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label htmlFor="website">Date de naissance</label>
                            <input type="date" id="date_naissance" className="form-control" placeholder="Date de naissance" name='date_naissance' value={date_naissance} onChange={(e) => setDate_naissance(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label htmlFor="phone">Adresse</label>
                            <input type="text" className="form-control" id="adresse" placeholder="Enter votre adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label htmlFor="website">Nationnalité</label>
                            <input type="text" className="form-control" id="natinalite" placeholder="Enter votre nationnalité" value={nationalite} onChange={(e) => setNationalite(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    
                    </div>
                    <div className="row gutters soustitres">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <h4 className="mt-3 mb-2">Contact</h4>
                                <hr className="border border-1 custom-hr" />
                            </div>
                            
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                            <label for="sTate">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter votre email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                            <label for="zIp">Numéro téléphone</label>
                            <input type="text" className="form-control" id="numer_telephone" placeholder="Entrer votre numéro" value={numero_telephone} onChange={(e) => setNumero_telephone(e.target.value)}/>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='soustitres'>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <h4 className="mt-3 mb-2">Cv</h4>
                          <hr className="border border-1 custom-hr" />
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <label>
                            choisir votre cv
                            </label> <br/>
                            <input type="file" className="upload-box"   onChange={handleCvChange} />
                    </div>
                      </div>
                      <br/> 
                      <label>
                        vous voulez consulter ou télécharger votre ancien cv?
                      </label> 
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2">
                        {cv ? (
                          <a href={cv} download className="btn btn-primary" id="btntelecharger">
                            Télécharger votre CV
                          </a>
                        ) : (
                          <p>Vous n'avez pas encore chargé votre CV.</p>
                        )}
                      </div>
                      
                    {competences && Array.isArray(competences) ? (
                      <div className="row gutters soustitres">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <h4 className="mt-3 mb-2">Compétences</h4>
                          <hr className="border border-1 custom-hr" />
                          <div>
                            <Link to={`/profile-utilisateur?showCompetenceModal=true`} className="btn btn-primary">
                              Ajouter Compétence
                            </Link>
                            <CompetencePopup
                            isOpen={showCompetenceModal}
                            onClose={handleCloseCompetenceModal}
                            onCompetenceSelect={handleCompetenceSelect}
                            selectedCompetences={selectedCompetences}
                            
                          />
                          </div>
                          <div className="competences-container">
                          {competences.map((competence) => (
                          <div className="competence-box" key={competence.id}>
                            {competence.nom}
                            <button
                              className="delete-competence-button"
                              onClick={(event) => handleDeleteCompetence(event, competence.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} className='icontrash' />
                            </button>
                          </div>
                          ))}

                          </div>
                        </div>
                      </div>
                    ) : null}
                  

                    <div className="row form-group text-center button-container">
                      <div className="col-md-12">
                        <input type="submit" style={{ marginLeft: '1px' }} value="Modifier votre profile" className="btn px-4 btn-primary text-white" />
                        <ToastContainer 
                     
                          />
                      </div>
                    </div>
                </form>

                </div>
                <div className={`tab-pane fade ${activeTab === 'account-change-password' ? 'active show' : ''}`} id="account-change-password">
                <div className="card-body pb-2">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <h4 className="mt-3 mb-2">Modifier mot de passe</h4>
                            <hr className="border border-1 custom-hr" />
                        </div>
                        <form onSubmit={handleModifierMotdepasse} >
                            <div className="form-group">
                              <label className="form-label">Mot de passe actuel</label>
                              <input type={showPassword ? 'text' : 'password'} className="form-control" style={{width:"450px"}} value={oldpassword} onChange={(e) => setOldpassword(e.target.value)} required />
                              <button
                                type="button"
                                className="btn btn-link password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{marginTop: "-80px",position: "relative",marginLeft:"280px"}}
                              >
                                <FontAwesomeIcon
                                  icon={showPassword ? faEyeSlash : faEye}
                                  className="password-toggle-icon" 
                                />
                              </button>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Nouveau mot de passe</label>
                              <input type={showPassword ? 'text' : 'password'} className="form-control" style={{width:"450px"}} value={newpassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                              <button
                                type="button"
                                className="btn btn-link password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{marginTop: "-80px",position: "relative",marginLeft:"280px"}}
                              >
                                <FontAwesomeIcon
                                  icon={showPassword ? faEyeSlash : faEye}
                                  className="password-toggle-icon" 
                                />
                              </button>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Confirmer mot de passe</label>
                              <input type={showPassword ? 'text' : 'password'} className="form-control" style={{width:"450px"}} value={renewpassword}  onChange={(e) => setReNewPassword(e.target.value)} required />
                              <button
                                  type="button"
                                  className="btn btn-link password-toggle-btn"
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{marginTop: "-80px",position: "relative",marginLeft:"280px"}}
                                >
                                  <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="password-toggle-icon" 
                                  />
                          </button>
                            </div>
                            <div className="row form-group text-center button-container">
                              <div className="col-md-12">
                                <input type="submit" style={{ marginLeft: '1px' }} value="Modifier mot de passe" className="btn px-4 btn-primary text-white" />
                                <ToastContainer 
                                    position="top-center"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                  />
                              </div>
                            </div>

                        </form>  

                </div>
                </div>
                {/* payement section */}
                <div className={`tab-pane fade ${activeTab === 'account-social-links' ? 'active show' : ''}`} id="account-social-links">
                <div classNameName="card-body pb-2">
                    <div className="col-md-8 lefttopcard">
                        <div >
                            <div className="containerpayement">
                                <div className="row">
                                    <div className="col-lg-4 mb-lg-0 mb-3">
                                        <div className="card p-3">
                                            <div className="img-box">
                                                <img src="https://www.freepnglogos.com/uploads/visa-logo-download-png-21.png" alt=""/>
                                            </div>
                                            <div className="number">
                                                <label className="fw-bold" for="">**** **** **** 1060</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <small><span className="fw-bold">Expiry date:</span><span>10/16</span></small>
                                                <small><span className="fw-bold">Name:</span><span>Kumar</span></small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mb-lg-0 mb-3">
                                        <div className="card p-3">
                                            <div className="img-box">
                                                <img src="https://www.freepnglogos.com/uploads/mastercard-png/file-mastercard-logo-svg-wikimedia-commons-4.png"
                                                    alt=""/>
                                            </div>
                                            <div className="number">
                                                <label className="fw-bold">**** **** **** 1060</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <small><span className="fw-bold">Expiry date:</span><span>10/16</span></small>
                                                <small><span className="fw-bold">Name:</span><span>Kumar</span></small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mb-lg-0 mb-3">
                                        <div className="card p-3">
                                            <div className="img-box">
                                                <img src="https://www.freepnglogos.com/uploads/discover-png-logo/credit-cards-discover-png-logo-4.png"
                                                    alt=""/>
                                            </div>
                                            <div className="number">
                                                <label className="fw-bold">**** **** **** 1060</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <small><span className="fw-bold">Expiry date:</span><span>10/16</span></small>
                                                <small><span className="fw-bold">Name:</span><span>Kumar</span></small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <div className="card p-3">
                                            <p className="mb-0 fw-bold h4">Payment Methods</p>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card p-3">
                                            <div className="card-body border p-0">
                                                <p>
                                                    <a className="btn btn-primary w-100 h-100 d-flex align-items-center justify-content-between"
                                                        data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true"
                                                        aria-controls="collapseExample">
                                                        <span className="fw-bold">PayPal</span>
                                                        <span className="fab fa-cc-paypal">
                                                        </span>
                                                    </a>
                                                </p>
                                                <div className="collapse p-3 pt-0" id="collapseExample">
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <p className="h4 mb-0">Summary</p>
                                                            <p className="mb-0"><span className="fw-bold">Product:</span><span className="c-green">: Name of
                                                                    product</span></p>
                                                            <p className="mb-0"><span className="fw-bold">Price:</span><span
                                                                    className="c-green">:$452.90</span></p>
                                                            <p className="mb-0">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque
                                                                nihil neque
                                                                quisquam aut
                                                                repellendus, dicta vero? Animi dicta cupiditate, facilis provident quibusdam ab
                                                                quis,
                                                                iste harum ipsum hic, nemo qui!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body border p-0">
                                                <p>
                                                    <a className="btn btn-primary p-2 w-100 h-100 d-flex align-items-center justify-content-between"
                                                        data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="true"
                                                        aria-controls="collapseExample">
                                                        <span className="fw-bold" style={{backgroundColor:"#2DAAE1"}}>Credit Card</span>
                                                        <span className="">
                                                            <span className="fab fa-cc-amex"></span>
                                                            <span className="fab fa-cc-mastercard"></span>
                                                            <span className="fab fa-cc-discover"></span>
                                                        </span>
                                                    </a>
                                                </p>
                                                <div className="collapse show p-3 pt-0" id="collapseExample">
                                                    <div className="row">
                                                        <div className="col-lg-5 mb-lg-0 mb-3">
                                                            <p className="h4 mb-0">Summary</p>
                                                            <p className="mb-0"><span className="fw-bold">Product:</span><span className="c-green">: Name of
                                                                    product</span>
                                                            </p>
                                                            <p className="mb-0">
                                                                <span className="fw-bold">Price:</span>
                                                                <span className="c-green">:$452.90</span>
                                                            </p>
                                                            <p className="mb-0">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque
                                                                nihil neque
                                                                quisquam aut
                                                                repellendus, dicta vero? Animi dicta cupiditate, facilis provident quibusdam ab
                                                                quis,
                                                                iste harum ipsum hic, nemo qui!</p>
                                                        </div>
                                                        <div className="col-lg-7">
                                                          
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="form__div">
                                                                            <input type="text" className="form-control" placeholder=" "/>
                                                                            <label for="" className="form__label">Card Number</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-6">
                                                                        <div className="form__div">
                                                                            <input type="text" className="form-control" placeholder=" "/>
                                                                            <label for="" className="form__label">MM / yy</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-6">
                                                                        <div className="form__div">
                                                                            <input type="password" className="form-control" placeholder=" "/>
                                                                            <label for="" className="form__label">cvv code</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <div className="form__div">
                                                                            <input type="text" className="form-control" placeholder=" "/>
                                                                            <label for="" className="form__label">name on the card</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <div className="btn btn-primary w-100" style={{ backgroundColor: "#f36969" }}>Sumbit</div>
                                                                    </div>
                                                                </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn btn-primary payment" style={{ backgroundColor: "#f36969" }}>
                                           <span className="textmakepayement">Make Payment</span> 
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                   
                </div>
                </div>
                <div className={`tab-pane fade ${activeTab === 'account-connections' ? 'active show' : ''}`} id="account-connections">
                <div className="card-body">
                    <button type="button" classNameName="btn btn-twitter">Connect to <strong>Twitter</strong></button>
                </div>
                <hr classNameName="border-light m-0" />
                <div className="card-body">
                    <h4 classNameName="mb-2">
                    <a href="javascript:void(0)" classNameName="float-right text-muted text-tiny"><i classNameName="ion ion-md-close"></i> Remove</a>
                    <i classNameName="ion ion-logo-google text-google"></i>
                    You are connected to Google:
                    </h4>
                    <a href="/cdn-cgi/l/email-protection" classNameName="__cf_email__" data-cfemail="620c0f031a15070e0e220f030b0e4c010d0f">[email&#160;protected]</a>
                </div>
                <hr className="border-light m-0" />
                <div className="card-body">
                    <button type="button" className="btn btn-facebook">Connect to <strong>Facebook</strong></button>
                </div>
                <hr className="border-light m-0" />
                <div className="card-body">
                    <button type="button" className="btn btn-instagram">Connect to <strong>Instagram</strong></button>
                </div>
                </div>
                
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  societe: state.auth.user && state.auth.user.societe,
  personne: state.auth.user && state.auth.user.personne,
  role: state.auth.user && state.auth.user.role,
  id: state.auth.user && state.auth.user.id, // Add this line to get the id
  token: localStorage.getItem('access') ,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(load_user()),
    modifierPersonne: (id, personne) => dispatch(modifierPersonne(id, personne)),
    ajoutercompetenceuser:(data)=>dispatch(ajoutercompetenceuser(data)),
    supprimercompetencecandidat: (data) => dispatch(supprimercompetencecandidat(data)),
    reset_password_confirm: (id, token, newpassword, renewpassword)=>dispatch(reset_password_confirm(id, token, newpassword, renewpassword)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);