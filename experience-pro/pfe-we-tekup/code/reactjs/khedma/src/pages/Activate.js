import React, {useState} from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';

import {connect} from 'react-redux';
import Navbar from '../components/Navbar';
import './Login.css';
import { verify } from '../actions/auth';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';

const Activate = ({verify, isAuthenticated}) =>{
    const routeParams = useParams();
    const [verified, setVerified] = useState(false);
    const verify_account = e => {
        const uid =routeParams.uid;
        const token = routeParams.token;

        verify(uid, token);
        setVerified(true);
    };

    if (verified) {
        return <Navigate to='/' />
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
        <div 
                className='d-flex flex-column justify-content-center align-items-center'
                style={{ marginTop: '30px' }}
            >
                <h1>Vérifier votre compte:</h1>
                <button
                    onClick={verify_account}
                    style={{ marginTop: '50px' }}
                    type='button'
                    className='btn btn-primary'
                >
                    Activer votre compte
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default connect(null,{verify})(Activate);