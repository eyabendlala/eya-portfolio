import React, { useState, useEffect } from 'react';
import '../profile/Profile.css';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import Navbar from '../../components/Navbar';
import CryptoJS from 'crypto-js';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { faUser, faGear, faRightFromBracket, faStar, faLock, faCreditCard,faAddressCard,faList,faLocationDot,faFlag,faPhone,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getSocieteParId, load_user } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEdge, faFacebook, faInstagram, faLinkedin, faPinterest, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const DetailSociete= ()=> {
    const { id } = useParams();
    //console.log("id from useParams:", id);
    const decodedId = decodeURIComponent(id);
    //console.log("decoded id is:", decodedId);
    const decryptedId = CryptoJS.AES.decrypt(decodedId, 'secretKey').toString(CryptoJS.enc.Utf8);
    //console.log("decrypted id is:",decryptedId);
  const [activeTab, setActiveTab] = useState('account-general');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [numero_telephone, setNumero_telephone] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [nom, setNom] = useState('');
  const [description,setDescription]=useState('');
  const [website, setWebsite] = useState('');
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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSocieteParId(decryptedId);
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
    if (decryptedId) {
        fetchData();
      }
    }, [decryptedId]);
    
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
  return (
    <div className="site-wrap">
      <Navbar></Navbar>
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
      <div className="container align-items-center justify-content-center" style={{borderColor:"#2DAAE1",marginLeft:"15%"}}>
        <div className="overflow-hidden">
          <div className="row no-gutters row-bordered row-border-light">
            <div className="tab-content">
                <div>
                    <form encType="multipart/form-data">
                    
                      <div className="card-body">
                      <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                              <img src={logo} alt="ProfileENTREPRISE" className="d-block ui-w-80" />  
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 " style={{marginTop:"20px",marginLeft:"-150px"}}>
                                <h4 className="mb-2 d-flex align-items-center" style={{color:"#2DAAE1"}}>{nom}</h4>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faAddressCard} style={{ color: "black",marginTop:"-5px" }} />
                                    <h5 className="mb-2 ml-2" >{slogan}</h5>
                                </div>
                            </div>
                        </div>
                      <br/> <br/>
                  <div className="row">
                            <span style={{ color: "grey",fontSize:"18px",marginLeft:"20px"}}>{description}</span>
                  </div>
                  <br/>
                  <div className="row gutters soustitres"  style={{marginLeft:"5px"}}>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h4 className="mt-3 mb-2">Information Général</h4>
                        <hr className="border border-1 custom-hr" />
                    </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                           <FontAwesomeIcon icon={faList} style={{ color: "black" }} />&nbsp;&nbsp;
                            <span style={{ color: "black",fontSize:"18px" }}>Secteur: {secteur}</span>
                  </div><br/><br/>
                
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                            <FontAwesomeIcon icon={faLocationDot} style={{ color: "black" }} />&nbsp;&nbsp;
                            <span style={{ color: "black",fontSize:"18px" }}>{adresse}</span>
                        </div>
                    </div>
                     <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                            <FontAwesomeIcon icon={faFlag} style={{ color: "black" }} /> &nbsp;&nbsp;
                            <span style={{ color: "black",fontSize:"18px" }}>{nationalite}</span>
                            </div>
                        </div>
                  
    
                  </div>
                </div>
                <div className="row gutters soustitres" style={{marginLeft:"5px"}}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <h4 className="mt-3 mb-2">Contact</h4>
                            <hr className="border border-1 custom-hr" />
                        </div>
                        
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                                <span style={{ color: "black",fontSize:"18px" }}>{email}</span>
                            </div>
                            </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                <FontAwesomeIcon icon={faPhone} style={{ color: "black" }} />&nbsp;&nbsp;
                                
                                <span style={{ color: "black",fontSize:"18px" }}>{numero_telephone}</span>
                                </div>
                            </div>
                        
                </div>
                <div className="row gutters soustitres"  style={{marginLeft:"5px"}}>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h4 className="mt-3 mb-2">Réseaux Sociaux</h4>
                        <hr className="border border-1 custom-hr" />
                    </div>

                    {/* Facebook and Instagram */}
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                                <FontAwesomeIcon icon={faFacebook} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                                <Link to={facebook} style={{ color: "black",fontSize:"16px" }}>{facebook}</Link>
                            </div>
                        <div className="form-group">
                          <FontAwesomeIcon icon={faInstagram} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                          <Link to={instagram} style={{ color: "black",fontSize:"16px" }}>{instagram}</Link>
                        </div>
                    </div>

                    {/* Twitter and LinkedIn */}
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <FontAwesomeIcon icon={faTwitter} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                          <Link to={twitter} style={{ color: "black",fontSize:"16px" }}>{twitter}</Link></div>
                        <div className="form-group">
                          <FontAwesomeIcon icon={faLinkedin} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                          <Link to={linkedin} style={{ color: "black",fontSize:"16px" }}>{linkedin}</Link>
                        </div>
                    </div>
                </div>
                {/* Pinterst et website */}
                <div className="row gutters" style={{marginLeft:"5px"}}>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <FontAwesomeIcon icon={faPinterest} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                        <Link to={pinterest} style={{ color: "black",fontSize:"18px" }}>{pinterest}</Link></div>
                    </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FontAwesomeIcon icon={faEdge} style={{ color: "black" }} />&nbsp;&nbsp;
                      <Link to={website} style={{ color: "black",fontSize:"16px" }}>{website}</Link></div>
                          
                  </div>

                </div>
                </form>

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
  });
  
  const mapDispatchToProps = (dispatch) => {
    return {
      loadUser: () => dispatch(load_user()),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(DetailSociete);
