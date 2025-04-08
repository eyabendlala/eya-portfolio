import React, { Fragment, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import logoImg from '../cssjs/images/logokhedma.png';
import { connect } from 'react-redux';
import { logout, load_user } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { faUser, faGear,faRightFromBracket,faComments, faDashboard, faFileAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from 'react-router-dom';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import {faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faStar  } from '@fortawesome/free-solid-svg-icons';


function Navbar({ logout, isAuthenticated, societe, personne, load_user, role }) {
  const navigate=useNavigate();
  useEffect(() => {
    load_user();
  }, [load_user]);

  const [click, setClick] = useState(false);
  
  const handleClick = () => setClick(!click);

  const iconClassName = click ? "fas fa-times" : "fas fa-bars";

  const onSubmitForm = async (event) => {
    event.preventDefault();
    
    toast.success('🦄 Vous devez vous connecter pour publier une poste', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  };
  const logoutuser = async (event) => {
    event.preventDefault();
    setClick(false)
    logout();
    navigate('/login');
  }
  
  const iPersonneRole = ['candidat', 'admin', 'employeur'].includes(role);
  const isSocieteRole=['societe'].includes(role);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const nomSociete= societe && societe.societe && societe.societe.nom;
  
  const nomPersonne= personne && personne.personne && personne.personne.nom;
  const prenomPersonne= personne && personne.personne && personne.personne.prenom;
  const imagePersonne=personne && personne.personne && personne.personne.image;
  const imageSociete= societe && societe.societe && societe.societe.logo;


  const isEmployeurOrSociete = ['employeur', 'societe'].includes(role);
  const isCandidat = ['candidat'].includes(role);

  const guestLinks = () => (
      <Link to="/login" className='button-login' onClick={()=>setClick(false)}>
        <span className="icon-lock_outline"> Login</span>
      </Link>  
  );

  const authLinks = () => (
    <>
      <DropdownButton title={
          <div>
              {
              (iPersonneRole && imagePersonne) ? (
                <div className="avatar1 avatar-online">
                  <img src={imagePersonne} className="rounded-circle" alt="Personne" />
                </div>
              ) :
              (isSocieteRole && imageSociete) ? (
              <div className="avatar1 avatar-online">
                <img src={imageSociete} className="rounded-circle" alt="Societe" />
              </div>
              ) : (
              <div className="avatar1 avatar-online">
                <FontAwesomeIcon icon={faUser} className="rounded-circle" alt="Societe" size="lg" style={{color:'#2daae1'}} />
              </div>
              )}
          </div>
        } variant="custom" className="user-dropdown-button">
        <Dropdown.Item className="custom-dropdown-item">
            <div className="d-flex">
              <div className="flex-grow-1">
              {iPersonneRole && imagePersonne && (
                <div className="avatar1 avatar-online">
                  <img src={imagePersonne} className="rounded-circle" />
                </div>
              )}
              {isSocieteRole && imageSociete && (
                <div className="avatar1 avatar-online">
                  <img src={imageSociete} className="rounded-circle" />
                </div>
              )}
                      
              </div>
              <div className="flex-grow-1">
                <span className="fw-semibold d-block">{nomSociete|| (nomPersonne && prenomPersonne && `${nomPersonne} ${prenomPersonne}`)}</span>
              </div>
            </div>
        </Dropdown.Item>

        <Dropdown.Item className="custom-dropdown-item" onClick={()=>setClick(false)}  href={role === 'societe' ? '/profile-societe' : '/profile-utilisateur'}>
          {role === 'societe' && (
            <div>
              <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;
              <span className="align-middle">Mon Profile</span>
            </div>
          )}
          {(role === 'candidat' || role === 'employeur' || role === "admin" ) && (
            <div>
              <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;
              <span className="align-middle">Mon Profile</span>
            </div>
          )}
        </Dropdown.Item>

        {isAuthenticated && isEmployeurOrSociete && (
          <Dropdown.Item className="custom-dropdown-item"
          onClick={() => {
            navigate('/recruteur/analyse'); 

            setClick(false);
          }}>
          <FontAwesomeIcon icon={faBriefcase}/> &nbsp;&nbsp;
          <span className="align-middle">Espace Recruteur Pro</span>
          </Dropdown.Item>
         )}


        {isAuthenticated && isCandidat && (
          <Dropdown.Item className="custom-dropdown-item"
          onClick={() => {
            navigate('/favoris'); 

            setClick(false);
          }}>
          <FontAwesomeIcon icon={faBriefcase}/> &nbsp;&nbsp;
          <span className="align-middle">Espace Candidat</span>
          </Dropdown.Item>
         )}


        <Dropdown.Item className="custom-dropdown-item">
            <FontAwesomeIcon icon={faGear}/> &nbsp;&nbsp;
            <span className="align-middle">Paramètre</span>
        </Dropdown.Item>
        {role === 'admin' && (
          <Dropdown.Item href='/admin' className="custom-dropdown-item">
          <FontAwesomeIcon icon={faDashboard}/> &nbsp;&nbsp;
          <span className="align-middle">Admin</span>
          </Dropdown.Item>
        )}
        <Dropdown.Item className="custom-dropdown-item" onClick={logoutuser}>
            <FontAwesomeIcon icon={faRightFromBracket}/> &nbsp;&nbsp;
            <span className="align-middle">Logout</span>
        </Dropdown.Item>
      </DropdownButton>
      
    </>
  );

  return (       
    <>
      <header className="site-navbar mt-3" >
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
        <nav>
          <div className="nav-container">
            <NavLink exact to="https://khedma.site/" className="nav-logo">
                <img src={logoImg} alt="khedma" width="200px" height="85px" />
            </NavLink>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              {click ? (<li className='nav-title'> <span>Menu</span> </li>) : null}
              <li className="nav-item">
                <NavLink
                  exact
                  to="/"
                  activeClassName="active"
                  className="nav-links"
                  onClick={()=> setClick(false)}
                >Accueil</NavLink>
              </li>
              <li className="nav-item">
              <DropdownButton title="Emplois" variant="custom" className="custom-dropdown-button">
                <Dropdown.Item className="custom-dropdown-item"  href="/emplois" onClick={()=>setClick(false)}>Offres d'emplois</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item"  href="/publier-emploi" onClick={()=>setClick(false)}>Poster un emploi</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item"  href="/AddAbon" onClick={()=>setClick(false)}>Ajouter un abonnement</Dropdown.Item>
              </DropdownButton>
              </li>
              <li className="nav-item">
                <DropdownButton title="Employeurs" variant="custom" className="custom-dropdown-button">
                  <Dropdown.Item className="custom-dropdown-item"  href="/listedessocietes" onClick={()=>setClick(false)}>Liste des entreprises</Dropdown.Item>
                </DropdownButton>
              </li>
              <li className="nav-item">
                <NavLink
                  exact
                  to="/listedesemployes"
                  activeClassName="active"
                  className="nav-links"
                  onClick={()=>setClick(false)}
                >Employés
                </NavLink>
              </li>

              {/* Dropdown for Events */}
          
              {isAuthenticated && isEmployeurOrSociete && (
              <li className="nav-item">
                <DropdownButton title="Evénement" variant="custom" className="custom-dropdown-button">
                {isAuthenticated && isEmployeurOrSociete && (
                  <Dropdown.Item className="custom-dropdown-item" href="/ajouter-event" onClick={() => setClick(false)}>Publier événement</Dropdown.Item>
                )}
                {isAuthenticated && isEmployeurOrSociete && (
                  <Dropdown.Item className="custom-dropdown-item" href="/event-list" onClick={() => setClick(false)}>Liste des événements</Dropdown.Item>
                )}
               
                </DropdownButton>
              </li>
              )}

   {/* {isAuthenticated && isCandidat && ( */}
   {(!isAuthenticated || isCandidat) && (
          <li className="nav-item">
            <NavLink exact to="/participate-event" activeClassName="active" className="nav-links" onClick={() => setClick(false)}> Evénement </NavLink>
          </li>
        )}
    {/* )} */}

              {isAuthenticated && (
                <li className="nav-item">
                  <NavLink to="/chat" activeClassName="active" className="nav-links" onClick={()=>setClick(false)}>
                    <FontAwesomeIcon icon={faComments}/> Discussion
                  </NavLink>
                </li>
              )}
             {/* Affiche le bouton seulement si le rôle est 'societe' ou 'employeur' */}
             {(isEmployeurOrSociete || !role) && (
              <li className="nav-item">
                <Link to="/publier-emploi" onClick={()=>setClick(false)}>
                  <span className="icon-add publier-emploi"> Publier Emploi</span>
                </Link>
              </li>
             )}
              {isAuthenticated ? (
                  <li className="nav-item">
                    <div>
                      {authLinks()}
                    </div>
                  </li>
              ) : (
                // If not authenticated, display toast and login link
                <li className="nav-item">
                      {guestLinks()}
                </li>
              )}
            </ul>

            <div className="nav-icon" onClick={handleClick}>
              <i className={iconClassName}></i>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  societe: state.auth.user && state.auth.user.societe,
  personne: state.auth.user && state.auth.user.personne,
  role: state.auth.user&& state.auth.user.role,
});


export default connect(mapStateToProps, { logout, load_user })(Navbar);