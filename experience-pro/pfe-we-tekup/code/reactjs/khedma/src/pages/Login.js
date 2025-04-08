import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import './Login.css';
import { login } from '../actions/auth';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
//pour les alertes
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Form, Col, Button, FormGroup, FormControl } from 'react-bootstrap';

const Login = ({login, isAuthenticated, role,id}) =>{
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer le freeze
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]= useState(
    {
      email:'',
      password:''
    }
  );
  const{email, password}= formData;
  const [error, setError] = useState('');
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return; // Empêche plusieurs requêtes simultanées
  
    setIsSubmitting(true); // Freeze du bouton pendant l'envoi de la requête
  
    try {
      const success = await login(email, password);
  
      if (success) {
        toast.success('🦄 Bienvenue dans khedma.site', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 4000
        });
      } else {
        setError('Veuillez vérifier votre e-mail et/ou votre mot de passe.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur est survenue, veuillez réessayer.');
    } finally {
      setIsSubmitting(false); // Réactive le bouton après la requête
    }
  };
  

  
  // is the user authenticated
  //redirect them to home page
  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to="/admin" />;
    } else if(role ==='candidat' || role==='employeur' || role==='societe') {
      return <Navigate to="/" />;
    }
  }

  const handleSignIn = ()=>{
      navigate('/signup')
  }
  
  return (
      <>
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
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">S'inscrire/Se connecter</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Acceuil</a> <span className="mx-2 slash">/</span>
                  <span className="text-white"><strong>Connexion</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
          <Row className="justify-content-md-center mt-5">
            <Col md={12}>
                <Form onSubmit={e => onSubmit(e)}>
                <Row>
                  <Col md={12} className='text-center'>
                      <span className="mb-4 titlelogin">Se Connecter</span>
                  </Col>
                </Row>
                <center>
                <Row className='justify-content-md-center' style={{margin:'auto'}}>
                  <Col md={6}>
                    <center>{error && <p className="error-message">{error}</p>}</center>
                    <FormGroup>
                        <Form.Label className="mb-3 text-black" htmlFor="email"><span className='labelspan'>Adresse Email</span></Form.Label>
                        <FormControl type="text" 
                                     id="email" 
                                     placeholder="Adresse Email" 
                                     name='email' 
                                     value={email} 
                                     onChange={e => onChange(e)} required/>
                        <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                    </FormGroup>
                  </Col>
                </Row>
                </center>
                <center>
                <Row className='justify-content-md-center mt-4' style={{margin:'auto'}}>
                  <Col md={6}>
                    <FormGroup>
                        <Form.Label className="text-black mb-3" htmlFor="password"><span className='labelspan'>Mot De Passe</span></Form.Label>
                        <FormControl
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          placeholder="Mot de passe"
                          name="password"
                          value={password}
                          onChange={(e) => onChange(e)}
                          minLength="6"
                          required
                        />
                          <Button
                            className="btn btn-link password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{backgroundColor:'transparent', width:'1rem',border:'none', marginRight:'2rem'}}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                              className="password-toggle-icon" 
                            />
                          </Button>
                          <FontAwesomeIcon icon={faLock} className='iconlogin' />
                      </FormGroup>
                  </Col>
                </Row>
                </center>
                <Row className='mt-4'>
                  <Col md={12}>
                    <p className='text-center'>
                      <a href='/reset-password'>Mot de passe oublié?</a>
                    </p>
                    <br/>
                  </Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Col md={12} className="text-center">
                    <Button type="submit" value="LogIn"> Connexion</Button>
                  </Col>
                </Row>
                <br></br>
                <Row className='mb-5'> 
                    <Col md={12} className="text-center">
                        <span style={{color:'red'}}> Vous n'avez pas de compte? </span>
                        <br></br>
                        <Button onClick={handleSignIn}>Créer un compte</Button>
                    </Col>
                </Row>
                </Form>
              </Col>              
          </Row>
      </>
  );
};
const mapStateToProps= state =>({
  isAuthenticated: state.auth.isAuthenticated,
  role: state.auth.user&& state.auth.user.role,
});

export default connect(mapStateToProps,{login})(Login);