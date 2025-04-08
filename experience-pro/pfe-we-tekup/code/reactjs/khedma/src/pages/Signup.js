import React, {useState,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram ,faLinkedin, faPinterest,faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot,faFlag, faVenusMars,faGlobe,faDownLeftAndUpRightToCenter, faPhone} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from "react-quill";
import { Link, Navigate } from 'react-router-dom';
import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import './Signup.css';
import {signup } from '../actions/auth';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import flagImg from '../cssjs/images/tunisianflag.png';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom'; 
import { Button, Col, Row } from 'react-bootstrap';

const Signup = ({ signup, isAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [numero_telephone, setNumero_telephone] = useState('');
  const [role, setRole] = useState('candidat');
  const [nationalite, setNationalite] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setRe_password] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [genre, setGenre] = useState('homme');
  const [date_naissance, setDate_naissance] = useState('');
  const[description,setDescription]=useState('');
  const [website, setWebsite] = useState('');
  const [secteur, setSecteur] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinterest, setPinterest] = useState('');
  const [slogan, setSlogan] = useState('');
  const [image, setImage] = useState(null);
  const [step, setStep] = useState(1);
  const [fieldError, setFieldError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const [logo, setLogo] = useState(null);
  const [erreur, setErreur] = useState(false);
  

  const [richTextDescription, setRichTextDescription] = useState('');

  const handleDescriptionChange = (value) => {
    setRichTextDescription(value);
    
    // Check if the description exceeds a certain length
    if (value.length <= 190) {
      setDescription(DOMPurify.sanitize(value));
      setErreur(false);
    } else {
      setErreur(true);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Vérifier si les mots de passe correspondent
    if (password !== re_password) {
      setFieldError('Les mots de passe ne correspondent pas.');
      return;
    }
    else{
      const formData = new FormData();
      // Append other form data fields to the formData
      formData.append('email', email);
      formData.append('adresse', adresse);
      formData.append('numero_telephone', numero_telephone);
      formData.append('role', role);
      formData.append('nationalite', nationalite);
      formData.append('password', password);
      formData.append('re_password', re_password);
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('genre', genre);
      formData.append('date_naissance', date_naissance);
      formData.append('description',  DOMPurify.sanitize(description));
      formData.append('website', website);
      formData.append('secteur', secteur);
      formData.append('image',image);
      formData.append('logo',logo);
      formData.append('facebook',facebook);
      formData.append('twitter',twitter);
      formData.append('instagram',instagram);
      formData.append('linkedin',linkedin);
      formData.append('pinterest',pinterest);
      formData.append('slogan',slogan);

      
      const success = await signup(formData);
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value); // Log the key-value pairs to the console
      // }
  
    // Vérifier si l'inscription a réussi
    if (success) {
      setStep(2);
      setAccountCreated(true);
      toast.success('🦄 Votre compte est crée avec succés veuillez vérifier votre boite mail pour activer votre compte', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    else{
      return alert("Cette adresse mail est déja utilisé");
    }
      //setFieldError('Veuillez utiliser une adresse email valide.');
  
    }
    
    
  };
  useEffect(() => {
    // Remove <p> and </p> tags but preserve spaces
    const cleanDescription = description.replace(/<\/?p>/g, '');
    setDescription(cleanDescription);
  }, [description]);
  
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (accountCreated) {
    return <Navigate to="/login" />;
     
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
              <h1 className="text-white font-weight-bold">Sign Up/Login</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Log In</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section text-center d-flex justify-content-center align-items-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                      <form onSubmit={onSubmit} className="signup-form">
                        <span className='titleSignUp'>Créer un compte</span> <br/>
                        {fieldError && <p className="error-message">{fieldError}</p>}
                        <div className="row form-group justify-content-center align-items-center">
                          <div>
                            <label className="text-black" htmlFor="role"><span className="labelspan">Role</span></label>
                          </div>
                          <div className="col-md-12 d-flex justify-content-center" style={{width:"450px"}}>
                            <select id="role" className="form-control input-select" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                              <option value="candidat">Candidat</option>
                              <option value="societe">Societe</option>
                              <option value="employeur">Employeur Individuel</option>
                              
                            </select>
                          </div>
                        </div>

                <div className="row form-group">
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="text-black" htmlFor="email" ><span className='labelspan'>Adresse Email</span></label>
                    <input type="text" id="email" className="form-control" placeholder="Adresse Email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="text-black" htmlFor="numero_telephone" ><span className="labelspan">Numéro de téléphone</span></label>
                    {/* <img src={flagImg} alt="Tunisian Flag" className="country-flag"  />     */}
                    <input type="text" id="numero_telephone" className="form-control input_telephone" placeholder="Numéro de téléphone" name="numero_telephone"  value={numero_telephone} onChange={(e) => setNumero_telephone(e.target.value)} required />
                    <FontAwesomeIcon icon={faPhone} className='iconlogin'/>
                  </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="email"><span className='labelspan'>Adresse</span></label>
                        <input type="text" id="adresse" className="form-control" placeholder="Adresse" name='adresse' value={adresse} onChange={(e) => setAdresse(e.target.value)} required/>
                        <FontAwesomeIcon icon={faLocationDot} className='iconlogin'/>
                    </div>
                    <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="email"><span className='labelspan'>Nationnalité</span></label>
                        <input type="text" id="nationalite" className="form-control" placeholder="Nationnalité" name='nationalite' value={nationalite} onChange={(e) => setNationalite(e.target.value)} required/>
                        <FontAwesomeIcon icon={faFlag} className='iconlogin' />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="password" ><span className='labelspan'>Mot De Passe</span></label>
                        <input type={showPassword ? 'text' : 'password'} id="password" className="form-control" placeholder="Nouveau mot de passe" name='password' value={password} onChange={(e) => setPassword(e.target.value)} minLength='6' required />
                        
                        <button
                            type="button"
                            className="btn password-toggle-btn" 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{width:"auto"}}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                              className="password-toggle-icon" 
                            />
                          </button>
                        <FontAwesomeIcon icon={faLock} className='iconlogin' />
                    </div>
                    <div className="col-md-6 mt-3 mt-md-0">
                        <label className="text-black" htmlFor="password" ><span className='labelspan'>Confirmer mot de passe</span></label>
                        <input type={showPassword ? 'text' : 'password'} id="re_password" className="form-control" placeholder=" Confirmer nouveau mot de passe" name='re_password' value={re_password} onChange={(e) => setRe_password(e.target.value)} minLength='6' required />
                        <button
                            type="button"
                            className="btn btn-link password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{width:"auto"}}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                              className="password-toggle-icon" 
                            />
                          </button>
                        <FontAwesomeIcon icon={faLock} className='iconlogin' />
                    </div>
                </div>
  
                        {role === 'candidat' && (
                          <>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="email"><span className='labelspan'>Nom</span></label>
                                  <input type="text" id="nom" className="form-control" placeholder="Nom" name='nom' value={nom} onChange={(e) => setNom(e.target.value)} required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                                  <FontAwesomeIcon icon="fa-regular fa-user" />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="email" ><span className='labelspan'>Prénom</span></label>
                                  <input type="text" id="prenom" className="form-control" placeholder="Prénom" name='prenom' value={prenom}  onChange={(e) => setPrenom(e.target.value)}required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin' />
                              </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="genre" >
                                <span className='labelspan'>Genre</span>
                              </label>
                              <select id="genre" className="form-control input-select" name='genre'
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                              >
                                
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                                <option value="autre">Autre</option>
                              </select>
                              <FontAwesomeIcon icon={faVenusMars} className='iconlogin' />

                            </div>
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="date_naissance">
                                <span className='labelspan'>Date de naissance</span>
                              </label>
                              <input
                                type="date"
                                id="date_naissance"
                                className="form-control"
                                placeholder="Date de naissance"
                                name='date_naissance'
                                value={date_naissance}
                                onChange={(e) => setDate_naissance(e.target.value)}
                                required
                              />
                          
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="image">
                                <span className="labelspan">Choisir votre photo</span>
                              </label>
                              <input
                                type="file" accept="image/*" className="upload-box" onChange={(e) => setImage(e.target.files[0])} required
                              />
                            </div>
                          </div>


                          
                          </>
                        )}
                        {role === 'societe' && (
                          <>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="nom" ><span className='labelspan'>Nom de l'entreprise</span></label>
                                  <input type="text" id="nom" className="form-control" placeholder="Nom" name='nom' value={nom} onChange={(e) => setNom(e.target.value)} required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                                  <FontAwesomeIcon icon="fa-regular fa-user" />
                              </div>



                              <div className="col-md-6 mt-3 mt-md-0">
  <label className="text-black" htmlFor="description" >
    <span className="labelspan">Description</span>
  </label>

  <div className="quill-container" style={{ border: '2px solid #06A9F1', borderRadius: '24px', height: '95px', overflow: 'auto' }}>
  <div className="description-text" style={{ textAlign: 'justify' }}>

  <ReactQuill
  value={richTextDescription}
  onChange={handleDescriptionChange}
  modules={{
    toolbar: [
    [{ 'header': '1' }, { 'header': '2' }],
    ['bold', 'italic', 'link'],
    [{ 'list': 'bullet' }],
    ['clean']
     ],
     }} required/>
  </div>
  
  {erreur && <div style={{ color: 'red' }}>La description ne doit pas dépasser 200 caractères.</div>}
                             </div> 
                             
                             
                             </div>






                            </div>

                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="website" ><span className='labelspan'>Site web</span></label>
                                  <input type="text" id="website" className="form-control" placeholder="website" name='website' value={website} onChange={(e) => setWebsite(e.target.value)} />
                                  <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                                  <FontAwesomeIcon icon={faGlobe} className='iconlogin' />

                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="secteur" ><span className='labelspan'>Secteur</span></label>
                                  <input type="text" id="secteur" className="form-control" placeholder="secteur" name='secteur' value={secteur}  onChange={(e) => setSecteur(e.target.value)} required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin' />
                              </div>
                            </div>
                            
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="twitter" ><span className='labelspan'>Twitter </span></label>
                                  <input type="url" id="twitter" className="form-control" placeholder="Twitter" name='twitter' value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                                  <FontAwesomeIcon icon={faTwitter} className='iconlogin' />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="instagram" ><span className='labelspan'>Instagram</span></label>
                                  <input type="url" id="instagram" className="form-control" placeholder="Instagram" name='instagram' value={instagram}  onChange={(e) => setInstagram(e.target.value)} />
                                  <FontAwesomeIcon icon={faInstagram} className='iconlogin' />
                              </div>
                            </div>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="facebook" ><span className='labelspan'>Facebook</span></label>
                                  <input type="url" id="facebook" className="form-control" placeholder="Facebook" name='facebook' value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                                  <FontAwesomeIcon icon={faFacebook} className='iconlogin' />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="linkedin" ><span className='labelspan'>Linkedin</span></label>
                                  <input type="url" id="linkedin" className="form-control" placeholder="Linkedin" name='linkedin' value={linkedin}  onChange={(e) => setLinkedin(e.target.value)} />
                                  <FontAwesomeIcon icon={faLinkedin} className='iconlogin' />
                              </div>
                            </div>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="pinterest"><span className='labelspan'>Pinterest</span></label>
                                  <input type="url" id="pinterest" className="form-control" placeholder="Pinterest" name='pinterest' value={pinterest}  onChange={(e) => setPinterest(e.target.value)} />
                                  <FontAwesomeIcon icon={faPinterest} className='iconlogin' />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="slogan" ><span className='labelspan'>Slogan</span></label>
                                  <input type="text" id="slogan" className="form-control" placeholder="Slogan" name='slogan' value={slogan}  onChange={(e) => setSlogan(e.target.value)} />
                                  <FontAwesomeIcon icon={faUser} className='iconlogin' />
                              </div>

                            </div>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                <label className="text-black" htmlFor="image">
                                  <span className="labelspan">Choisir votre logo</span>
                                </label>
                                <input
                                  type="file" accept="image/*" className="upload-box" onChange={(e) => setLogo(e.target.files[0])} required
                                />
                              </div>

                            </div>
                            
                          </>
                        )}
                        {role === 'employeur' && (
                          <>
                            <div className="row form-group">
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="email" ><span className='labelspan'>Nom</span></label>
                                  <input type="text" id="nom" className="form-control" placeholder="Nom" name='nom' value={nom} onChange={(e) => setNom(e.target.value)} required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                                  <FontAwesomeIcon icon="fa-regular fa-user" />
                              </div>
                              <div className="col-md-6 mt-3 mt-md-0">
                                  <label className="text-black" htmlFor="email"><span className='labelspan'>Prénom</span></label>
                                  <input type="text" id="prenom" className="form-control" placeholder="Prénom" name='prenom' value={prenom}  onChange={(e) => setPrenom(e.target.value)} required/>
                                  <FontAwesomeIcon icon={faUser} className='iconlogin' />
                              </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="genre" >
                                <span className='labelspan'>Genre</span>
                              </label>
                              <select id="genre" className="form-control input-select" name='genre'
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                              >
                            
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                                <option value="autre">Autre</option>
                              </select>
                              <FontAwesomeIcon icon={faVenusMars} className='iconlogin' />

                            </div>
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="date_naissance">
                                <span className='labelspan'>Date de naissance</span>
                              </label>
                              <input
                                type="date"
                                id="date_naissance"
                                className="form-control"
                                placeholder="Date de naissance"
                                name='date_naissance'
                                value={date_naissance}
                                onChange={(e) => setDate_naissance(e.target.value)}
                                required
                              />
                          
                            </div>
                          </div>
                          <div className="row form-group">
                            <div className="col-md-6 mt-3 mt-md-0">
                              <label className="text-black" htmlFor="image">
                                <span className="labelspan">Choisir votre photo</span>
                              </label>
                              <input
                                type="file" accept="image/*" className="upload-box" onChange={(e) => setImage(e.target.files[0])}
                              required />
                            </div>
                          </div>



                          
                          </>
                        )}
                        <Row>
                          <Col md={12} >
                            <Button className='mt-2 mb-2' type="submit" value="Créer un compte"> Créer un compte </Button>
                          </Col>
                        </Row>
                        <center>
                          <div className="text-center">
                            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
                          </div>
                        </center>
                      </form>
                    
                  </div>
                </div>
              </div>
            </section>
        </div>
      
        
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);