import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { faUser, faGear, faRightFromBracket, faStar, faLock, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getSocieteParId, load_user } from '../../actions/auth';
import { modifierSociete } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const ProfileSociete= (props)=> {
  const { id } = props;
  const [erreur, setErreur] = useState(false);
  const {token}=props;
  const [activeTab, setActiveTab] = useState('account-general');
  const [oldpassword, setOldpassword]=useState('');
  const [newpassword, setNewPassword] = useState('');
  const [renewpassword, setReNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [numero_telephone, setNumero_telephone] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [nom, setNom] = useState('');
  const [description,setDescription]=useState('');
  const [website, setWebsite] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [secteur, setSecteur] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pinterest, setPinterest] = useState('');
  const [slogan, setSlogan] = useState('');
  const [step, setStep] = useState(1);
  const [fieldError, setFieldError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [logo, setLogo] = useState('');
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [previousImage,setPreviousImage]= useState('');
  const[nomSociete,setNomSociete]=useState('');
  const[typeAbon,setTypeAbon]=useState('');
  const[categorieabon,setCategorieabon]=useState('');
  const[prixabon,setPrixAbon]=useState('');
  const[tentative,setTentative]=useState('');

  useEffect(() => {
    // Lorsque la description change, enlevez les balises <p> si elles sont présentes.
    const cleanDescription = description.replace(/<p>|<\/p>/g, '');
    setDescription(cleanDescription);
  }, [description]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() => {
    const fetchAbonnement = async () => {
      try {
        const response = await axios.get(`/Abonnement/abonementbyuser/${id}`);
        const data = response.data.abonnement;
        //console.log("abonnement ",data);
        setNomSociete(data.nom); // Set the abonnement data in the state
        setCategorieabon(data.categorie);
        setTypeAbon(data.typeAbon);
        setPrixAbon(data.prix);
        setTentative(data.tentative);
        //console.log("nom societe abonn",nomSociete);
      } catch (error) {
        //console.error('Error fetching abonnement:', error);
      }
    };

    fetchAbonnement();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSocieteParId(id);
        const data = response.data;
        //console.log(data.societe);
        setNom(data.societe.nom);
        setLogo(data.societe.logo);
        setSlogan(data.societe.slogan);
        setDescription(data.societe.description);
        setSecteur(data.societe.secteur);
        setNationalite(data.user.nationalite);
        setAdresse(data.user.adresse);
        setNumero_telephone(data.user.numero_telephone);
        setEmail(data.user.email);
        setTwitter(data.societe.twitter);
        setFacebook(data.societe.facebook);
        setInstagram(data.societe.instagram);
        setPinterest(data.societe.pinterest);
        setLinkedin(data.societe.linkedin);
        setWebsite(data.societe.website);
        setPreviousImage(data.societe.logo);
        
      } catch (error) {
        alert(error);
      }
    };
    if (id) {
        props.loadUser(); // Dispatch the load_user action
        fetchData();
      }
    }, [id]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const formData = new FormData(event.target); // Access form data using event.target
          formData.append('email', email);
          formData.append('adresse', adresse);
          formData.append('numero_telephone', numero_telephone);
          formData.append('role', role);
          formData.append('nationalite', nationalite);
          formData.append('nom', nom);
          formData.append('description', DOMPurify.sanitize(description));
          formData.append('slogan',slogan);
          formData.append('website', website);
          formData.append('secteur', secteur);
          formData.append('facebook',facebook);
          formData.append('twitter',twitter);
          formData.append('instagram',instagram);
          formData.append('linkedin',linkedin);
          formData.append('pinterest',pinterest);
          if (isImageChanged) {
            formData.append('logo', logo);
          }
          const response= await props.modifierSociete(id, formData);
          if (response) {
            toast.success('🦄 Votre profile est modifié avec succés!', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            //console.log('Profile updated successfully!');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
      };
      const modules = {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'bullet' }],
        ],
      };
    
      const formats = ['bold', 'italic', 'underline', 'list'];
      const handleDescriptionChange = (value) => {
        // Vérifier si la longueur du texte dépasse 200 caractères
        if (value.length <= 190) {
          setDescription(value);
          setErreur(false);
        }else{
          setErreur(true);
        }
      };
      const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
    
        // Check if a new file is selected
        if (selectedFile) {
          setLogo(selectedFile);
          setIsImageChanged(true); // Set the flag to indicate that a new image has been selected
        } else {
          setIsImageChanged(false); // Set the flag to indicate that no new image has been selected
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
              toast.success('🦄 Votre mot de passe est modifié avec succés!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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
    if ((props.role==="candidat")||(props.role==="employeur") ){
      return <Navigate to="/notfoundpage" />;

    }
  return (
    <div className="site-wrap">
      <Navbar></Navbar>
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
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Khedma.site</h1>
              <div className="custom-breadcrumbs">
                <span className="text-white"><strong>Trouvez le candidat idéal parmi notre réseau dynamique.</strong></span>
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
                  <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;Information Géneral
                </a>
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-change-password' ? 'active' : ''}`} onClick={() => handleTabClick('account-change-password')}>
                  <FontAwesomeIcon icon={faLock} /> &nbsp;&nbsp;Modifier mot de passe
                </a>
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-social-links' ? 'active' : ''}`} onClick={() => handleTabClick('account-social-links')}>
                  <FontAwesomeIcon icon={faCreditCard} /> &nbsp;&nbsp;Mes abonnements
                </a>
                {/* <a className={`list-group-item list-group-item-action ${activeTab === 'account-connections' ? 'active' : ''}`} onClick={() => handleTabClick('account-connections')}>
                  <FontAwesomeIcon icon={faGear} /> &nbsp;&nbsp;Paramétre
                </a> */}
              </div>
            </div>
            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'account-general' ? 'active show' : ''}`} id="account-general">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="card-body media align-items-center">
                    <img src={logo} alt="Profile" className="d-block ui-w-80" />
                        <div className="media-body ml-4">
                        <label>
                           choisir votre logo
                        </label> <br/>
                        <input type="file" accept="image/*"  className="upload-box"  onChange={handleImageChange} />
                        &nbsp;                      
                        </div>
                    </div>
                <hr className="border-light m-0" />
                <div className="card-body">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 soustitres">
                        <h4 className="mb-2 ">Détail de votre entreprise</h4>
                    </div>
                    <hr className="border border-1" style={{color:"black"}}></hr>
                    <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="fullName">Nom</label>
                        <input type="text" className="form-control" id="nom" placeholder="Enter votre nom" value={nom} onChange={(e) => setNom(e.target.value)} required/>

                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="eMail">slogan</label>
                        <input type="text" className="form-control" id="prénom" placeholder="Enter votre slogan" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <label className="text-black" htmlFor="description" style={{ marginLeft: '-30px' }}>
                      <span className="labelspan">Description</span>
                    </label>
                    <div className="quill-container" style={{ border: '2px solid #06A9F1', borderRadius: '24px', height: '95px', overflow: 'auto' }}>
                      <ReactQuill value={description} onChange={handleDescriptionChange} modules={modules} formats={formats} required />
                    </div>
                    {erreur && <div style={{ color: 'red' }}>La description ne doit pas dépasser 190 caractères.</div>}
                  </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="secteur">Secteur</label>
                        <input type="text" className="form-control" id="secteur" placeholder="Enter votre secteur" value={secteur} onChange={(e) => setSecteur(e.target.value)} required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="phone">Adresse</label>
                        <input type="text" className="form-control" id="adresse" placeholder="Enter votre adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="website">Nationnalité</label>
                        <input type="text" className="form-control" id="natinalite" placeholder="Enter votre nationnalité" value={nationalite} onChange={(e) => setNationalite(e.target.value)} required />
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
                            <input type="email" className="form-control" id="email" placeholder="Enter votre email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <label for="zIp">Numéro téléphone</label>
                            <input type="text" className="form-control" id="numer_telephone" placeholder="Entrer votre numéro" value={numero_telephone} onChange={(e) => setNumero_telephone(e.target.value)} required/>
                          </div>
                        
                        </div>
                    
                </div>
                <div className="row gutters soustitres">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h4 className="mt-3 mb-2">Réseaux Sociaux</h4>
                        <hr className="border border-1 custom-hr" />
                    </div>

                    {/* Facebook and Instagram */}
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                        <label htmlFor="fullName">Facebook</label>
                        <input type="url" className="form-control" id="facebook" placeholder="Enter votre facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                        </div>
                        <div className="form-group">
                        <label htmlFor="eMail">Instagram</label>
                        <input type="url" className="form-control" id="instagram" placeholder="Enter votre instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                        </div>
                    </div>

                    {/* Twitter and LinkedIn */}
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                        <label htmlFor="twitter">Twitter</label>
                        <input type="url" className="form-control" id="twitter" placeholder="Enter votre twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                        </div>
                        <div className="form-group">
                        <label htmlFor="linkedin">Linkedin</label>
                        <input type="url" className="form-control" id="linkedin" placeholder="Enter votre linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                        </div>
                    </div>
                </div>
                {/* Pinterst et website */}
                <div className="row gutters">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label for="pinterest">Pinteret</label>
                        <input type="url" className="form-control" id="pinterest" placeholder="Enter votre pinterest" value={pinterest} onChange={(e) => setPinterest(e.target.value)}/>
                      </div>
                    </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label for="website">Site web</label>
                      <input type="url" className="form-control" id="website" placeholder="Entrer votre website" value={website} onChange={(e) => setWebsite(e.target.value)}/>
                    </div>
                          
                  </div>

                </div>



                <div className="row form-group text-center button-container">
                  <div className="col-md-12">
                    <input type="submit" style={{ marginLeft: '1px' }} value="Modifier votre profile" className="btn px-4 btn-primary text-white" />
                  </div>
                </div>
                </form>

                </div>
                <div className={`tab-pane fade ${activeTab === 'account-change-password' ? 'active show' : ''}`} id="account-change-password">
                <div className="card-body pb-2 soustitres">
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
                                onClick={() => setShowPassword(!showPassword)} style={{marginTop: "-80px",position: "relative",marginLeft:"280px"}}
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
                                  onClick={() => setShowPassword(!showPassword)} style={{marginTop: "-80px",position: "relative",marginLeft:"280px"}}
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
                              </div>
                            </div>

                        </form>  

                </div>
                </div>
                <div className={`tab-pane fade ${activeTab === 'account-social-links' ? 'active show' : ''}`} id="account-social-links">
                <div className="card-body">
                <div >
                    <div className='cardPersonne' style={{backgroundColor:"#2DAAE1",color:"white"}}>
                        <div className='card-content'>
                          <div className='name-profession'>
                            <span className='name'><h3 style={{color:"white"}}>{nomSociete}</h3></span>
                            <span className='profession' style={{color:"white"}}>Type d'aboonement:&nbsp;{typeAbon}</span><br/>
                            <span className='profession' style={{color:"white"}}>Catégorie:&nbsp;{categorieabon}</span><br/>
                            <span className='profession' style={{color:"white"}}>Prix:&nbsp;&nbsp;{prixabon}Dt</span><br/>
                            <span className='profession' style={{color:"white"}}>Nbre de posts restants:&nbsp;{tentative}</span>
                          </div>
                        </div>
                        </div> 
                        </div>
                </div>
                </div>
                <div className={`tab-pane fade ${activeTab === 'account-connections' ? 'active show' : ''}`} id="account-connections">
                <div className="card-body">
                <div >
                        <div className='cardPersonne'>
              <div className='card-content'>
                <div className='name-profession'>
                  <span className='name'>{nomSociete}</span>
                  <span className='profession'>{typeAbon}</span>
                  <span className='profession'>{categorieabon}</span>
                  <span className='profession'>{prixabon}</span>
                  <span className='profession'>{tentative}</span>
                </div>
              </div>
              </div> 
                        </div>
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
      modifierSociete: (id, societe) => dispatch(modifierSociete(id, societe)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProfileSociete);