import {React, useState, useEffect} from "react";
import {Nav} from "react-bootstrap";
import './AdminNavbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router";
import { faBars, faChartLine, faUsers, faUserPlus, faUserTie, faExternalLink, faBriefcase, faGear, faSmile, faStar, faSignOutAlt, faCreditCard, faPlus, faRankingStar, faLaptopFile, faSitemap, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { logout, load_user } from '../actions/auth';

const AdminNavbar = ({logout}) => {

    const navigate=useNavigate();
    const [displayStyle, setDisplayStyle] = useState('none');
    const [displayStyleEmplois, setDisplayStyleEmplois] = useState('none');
    const [displayStyleEvent, setDisplayStyleEvent] = useState('none');
    const [displayStyleRating, setDisplayStyleRating] = useState('none');
    const logoutadmin = async (event) => {
      event.preventDefault();
      logout();
      navigate('/login');
      //console.log("logout success");
    }

    const handleUsers = () => {
      if(displayStyle === 'none')  {
        setDisplayStyleEmplois('none')
        setDisplayStyleRating('none')
        setDisplayStyle('block');
      }else{
        setDisplayStyle('none'); 
      }
    };

    const handleEmplois = () => {
      if(displayStyleEmplois === 'none')  {
        setDisplayStyle('none')
        setDisplayStyleRating('none')
        setDisplayStyleEmplois('block');
      }else{
        setDisplayStyleEmplois('none'); 
      }
    }

    const handleEvent = () => {
      if(displayStyleEvent === 'none')  {
        setDisplayStyle('none')
        setDisplayStyleRating('none')
        setDisplayStyleEvent('block');
      }else{
        setDisplayStyleEvent('none'); 
      }
    }


    const handleRating = () => {
        if(displayStyleRating === 'none')  {
          setDisplayStyle('none')
          setDisplayStyleEmplois('none')  
          setDisplayStyleRating('block');
        }else{
          setDisplayStyleRating('none'); 
        }
    }

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
     // console.log(menuOpen)
      setMenuOpen(!menuOpen);
    };

    return (
      <div className="admin-navbar">
        <div className="navbar-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} style={{color:"#2DAAE1"}} />
        </div>
        <Nav className={`navclass ${menuOpen ? "menu-open" : "col-md-12 d-none d-md-block"}`}
             style= {menuOpen ? {} : {position: 'fixed', width: '220px'}}
        activeKey="/admin"
        >
            <div className="navbar-items">
              <Nav.Item>
                  <Nav.Link href="/admin"> <FontAwesomeIcon icon={faChartLine} /> Dashboard</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
              <Nav.Link onClick={handleUsers}> <FontAwesomeIcon icon={faUserTie} /> Utilisateurs</Nav.Link>
              <ul>
                  <li style={{ display: displayStyle, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href="/admin/users" style={{ display: 'block' }}> <FontAwesomeIcon icon={faUsers} /> Visualiser</Nav.Link></li>
                  <li style={{ display: displayStyle, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href='/admin/addUser' style={{ display: 'block' }}><FontAwesomeIcon icon={faUserPlus} /> Ajouter</Nav.Link></li>
              </ul>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link onClick={handleEmplois}> <FontAwesomeIcon icon={faBriefcase} /> Emplois</Nav.Link>
                  <ul>
                    <li style={{ display: displayStyleEmplois, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href="/admin/emplois" style={{ display: 'block' }}> <FontAwesomeIcon icon={faLaptopFile} /> Visualiser</Nav.Link></li>
                    <li style={{ display: displayStyleEmplois, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href='/admin/addEmplois' style={{ display: 'block' }}><FontAwesomeIcon icon={faPlus} /> Ajouter</Nav.Link></li>
                  </ul>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link onClick={handleEvent}> <FontAwesomeIcon icon={faBriefcase} /> Evénement</Nav.Link>
                  <ul>
                    <li style={{ display: displayStyleEvent, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href="/admin/EventList" style={{ display: 'block' }}> <FontAwesomeIcon icon={faLaptopFile} /> Visualiser</Nav.Link></li>
                    <li style={{ display: displayStyleEvent, width: '180px', marginLeft:'-20px', textAlign: 'center' }}><Nav.Link href='/admin/addEvent' style={{ display: 'block' }}><FontAwesomeIcon icon={faPlus} /> Ajouter</Nav.Link></li>
                  </ul>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link href="/admin/secteurs"> <FontAwesomeIcon icon={faSitemap} /> Secteurs</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link href="/admin/reclamations"> <FontAwesomeIcon icon={faExclamationTriangle} /> Réclamations</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link onClick={handleRating}> <FontAwesomeIcon icon={faStar} />Rating</Nav.Link>
                  <ul>
                    <li style={{ display: displayStyleRating, width: '200px', marginLeft:'-30px' }}><Nav.Link href="/admin/ratingsociete"> <FontAwesomeIcon icon={faRankingStar} /> Rating Sociétés</Nav.Link></li>
                    <li style={{ display: displayStyleRating, width: '200px', marginLeft:'-30px' }}><Nav.Link href='/admin/ratingcandidat'><FontAwesomeIcon icon={faStar} />Rating Candidats</Nav.Link></li>
                  </ul>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link href="/admin/category"> <FontAwesomeIcon icon={faGear} /> Categories</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link href="/admin/competence"> <FontAwesomeIcon icon={faSmile} /> Compétences</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link href="/admin/abonnements"> <FontAwesomeIcon icon={faCreditCard} /> Abonnements</Nav.Link>
              </Nav.Item>
              <hr className="custom-hr"></hr>
              <Nav.Item>
                  <Nav.Link id="logout" onClick={logoutadmin}> <FontAwesomeIcon icon={faSignOutAlt} /> Logout</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                  <Nav.Link href='/' id="goto"> <FontAwesomeIcon icon={faExternalLink} /> Vers Khedma.Site</Nav.Link>
              </Nav.Item>
            </div>
        </Nav>
      </div>
    );
  };
  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    societe: state.auth.user && state.auth.user.societe,
    personne: state.auth.user && state.auth.user.personne,
    role: state.auth.user && state.auth.user.role,
  });
  
  
export default connect(mapStateToProps, { logout, load_user })(AdminNavbar);