import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
//pour les alertes
import { useEffect } from 'react';
import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import './Login.css';
import { reset_password } from '../actions/auth';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import { Col, Row, Button } from 'react-bootstrap';


const ResetPassword = ({ reset_password }) =>{
    const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData]= useState(
    {
      email:''
    }
  );
  const{email}= formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
      e.preventDefault();
      reset_password(email);
      setRequestSent(true);
  };
  // is the user authenticated
  //redirect them to home page
  useEffect(() => {
    if (requestSent) {
      alert('Veuillez vérifier votre e-mail pour réinitialiser votre mot de passe.');
    }
  }, [requestSent]);

  if (requestSent) {
    return <Navigate to='/' />;
  }
  return (
    <div className="site-wrap">
      <Navbar></Navbar>
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
      <section className="site-section text-center">
        <div className="container ">
          <div className='align-items-center custom-form'>
            
              <form onSubmit={e => onSubmit(e)}>
              <span className="titlelogin mb-4">Mot de passe oublié?</span>
                <Row>
                  <Col md={12}>
                      <label className="text-black mb-3" htmlFor="email"><span className='labelspan'>Adresse Email</span></label>
                      <div className="col-md-12">
                        <input type="text" id="email" className="form-control" placeholder="Adresse Email" name='email' value={email} onChange={e => onChange(e)} required/>
                        <FontAwesomeIcon icon={faUser} className='iconlogin'/>
                      </div>
                  </Col>
                </Row>
                
                <Row className="row form-group text-center button-container">
                  <Col md={12} className='mt-2'>
                    <Button type="submit" value="Modifier mot de passe"> Modifier mot de passe </Button>
                  </Col>
                </Row>
              </form>
                
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default connect(null,{reset_password})(ResetPassword);