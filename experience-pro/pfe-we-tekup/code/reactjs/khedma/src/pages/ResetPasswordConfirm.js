import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import {Navigate } from 'react-router-dom';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';
//pour les alertes
import { useEffect } from 'react';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ResetPasswordConfirm = ({ match, reset_password_confirm }) => {
    const [showPassword, setShowPassword] = useState(false);
    const routeParams = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        const uid =routeParams.uid;
        const token = routeParams.token;

        reset_password_confirm(uid, token, new_password, re_new_password);
        setRequestSent(true);
    };

    useEffect(() => {
        if (requestSent) {
          alert('Votre mot de passe est modifié avec succes');
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
                            <h2 className="mb-4 titlelogin">Mot de passe oublié?</h2>
                            <div className="row form-group">
                                <div>
                                    <label className="text-black" htmlFor="password"><span className='labelspan'>Mot De Passe</span></label>
                                </div>
                                </div>
                            <div className="row form-group">
                                <div className="col-md-12">
                                    <input type="password" id="new_password" className="form-control" placeholder="Nouveau mot de passe" name='new_password' value={new_password} onChange={e => onChange(e)} minLength='6' required />
                                    <button
                                        type="button"
                                        className="btn btn-link password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{width:"auto", marginLeft:"210px"}} 
                                    >
                                        <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="password-toggle-icon" 
                                        />
                                    </button>
                                    <FontAwesomeIcon icon={faLock} className='iconlogin' />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div>
                                    <label className="text-black" htmlFor="password"><span className='labelspan'>Mot De Passe</span></label>
                                </div>
                                </div>
                            <div className="row form-group">
                                <div className="col-md-12">
                                    <input type="password" id="re_new_password" className="form-control" placeholder=" confirmer nouveau mot de passe" name='re_new_password' value={re_new_password} onChange={e => onChange(e)} minLength='6' required />
                                    <button
                                        type="button"
                                        className="btn btn-link password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{width:"auto", marginLeft:"210px"}} 
                                    >
                                        <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="password-toggle-icon" 
                                        />
                                    </button>
                                    <FontAwesomeIcon icon={faLock} className='iconlogin' />
                                </div>
                            </div>
                            
                            
                            <div className="row form-group text-center button-container">
                            <div className="col-md-12">
                                <input type="submit" style={{marginLeft:'1px'}} value="Modifier mot de passe" className="btn px-4 btn-primary text-white " />
                            </div>
                            </div>
                        </form>
                        
                    
                </div>
                </div>
            </section>
    </div>
    );
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);