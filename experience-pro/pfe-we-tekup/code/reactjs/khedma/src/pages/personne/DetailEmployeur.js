import React, { useState, useEffect } from 'react';
import { faUser, faGear, faRightFromBracket, faStar, faLock, faCreditCard,faAddressCard,faLocationDot,faFlag,faVenus,faCalendar,faPhone,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getPersonneParId, load_user,geCompetencesByPerson } from '../../actions/auth';

import { modifierPersonne } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import CryptoJS from 'crypto-js';
function DetailEmployeur() {
  const { id } = useParams();
  //console.log("id from useParams:", id);
  const decodedId = decodeURIComponent(id);
  //console.log("decoded id is:", decodedId);
  const decryptedId = CryptoJS.AES.decrypt(decodedId, 'secretKey').toString(CryptoJS.enc.Utf8);
  //console.log("decrypted id is:",decryptedId);
  const [competences, setCompetences] = useState([]);
  useEffect(() => {
    const fetchCompetences = async () => {
        try {
            const response = await geCompetencesByPerson(decryptedId);
            const data = response.data;
            setCompetences(data);
        } catch (error) {
            alert(error);
        }
    };

    fetchCompetences();
}, [decryptedId]);
  //const [id, setId] = useState(''); // Using state to store the decrypted id
  //const [isLoading, setIsLoading] = useState(true); // Add loading state

  // useEffect(() => {
  //   const decryptId = async () => {
  //     try {
  //       const decryptedIdBytes = CryptoJS.AES.decrypt(encryptedId, 'SECRET_KEY');
  //       const decryptedId = CryptoJS.enc.Utf8.stringify(decryptedIdBytes);
  //       setId(decryptedId);
  //       setIsLoading(false); // Set loading state to false after decryption
  //     } catch (error) {
  //       console.error('Error decrypting ID:', error);
  //       setIsLoading(false); // Set loading state to false in case of an error
  //     }
  //   };

  //   decryptId();
  // }, [encryptedId]);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('account-general');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [titreduprofil, setTitrduprofil] = useState('');
  const [adresse, setAdresse] = useState('');
  const [numero_telephone, setNumero_telephone] = useState('');
  const [role, setRole] = useState('candidat');
  const [nationalite, setNationalite] = useState('');
  const [prenom, setPrenom] = useState('');
  const [genre, setGenre] = useState('');
  const [date_naissance, setDate_naissance] = useState('');
  const [image, setImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPersonneParId(decryptedId);
        const data = response.data;

        if (data.personne) {
          setNom(data.personne.nom);
          setImage(data.personne.image);
          setPrenom(data.personne.prenom);
          setTitrduprofil(data.personne.titreduprofil);
          setNationalite(data.user.nationalite);
          setAdresse(data.user.adresse);
          setNumero_telephone(data.user.numero_telephone);
          setEmail(data.user.email);
          setDate_naissance(data.personne.date_naissance);
          setGenre(data.personne.genre);
          setPreviousImage(data.personne.image);
        }
      } catch (error) {
          alert(error);
      }
    };
  
    fetchData(); // Always fetch data, no need to check for the ID dependency
  },[decryptedId]);
  
  // if (isLoading) {
  //   return <div>Loading...</div>; // Render a loading indicator while decrypting
  // }
  
  return (
    <div>
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
        <div className="container align-items-center justify-content-center" style={{borderColor:"#2DAAE1",marginLeft:"27%"}}>
        <div className="overflow-hidden">
          <div className="row no-gutters row-bordered row-border-light">
            <div className="tab-content">
                <div >
                    <form encType="multipart/form-data">
                    
                    <div className="card-body">
                    
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <img src={image} alt="Profile" className="d-block ui-w-80" />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 " style={{marginTop:"20px",marginLeft:"-100px"}}>
                                <h4 className="mb-2 d-flex align-items-center" style={{color:"#2DAAE1"}}>{nom} {prenom}</h4>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faAddressCard} style={{ color: "black",marginTop:"-5px" }} />
                                    <h5 className="mb-2 ml-2" >{titreduprofil}</h5>
                                </div>
                            </div>
                        </div>
                    <hr className="border border-1" style={{color:"black"}}></hr>
                    <div className="row">
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

                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                <FontAwesomeIcon icon={faVenus} style={{ color: "black" }} />&nbsp;&nbsp;
                            
                                <span style={{ color: "black",fontSize:"18px" }}>{genre}</span>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                <FontAwesomeIcon icon={faCalendar} style={{ color: "black" }} />&nbsp;&nbsp;
                                
                                <span style={{ color: "black",fontSize:"18px" }}>{date_naissance}</span>
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
                    <br/><br/><br/>
                </form>

                </div>
               
                
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}
export default DetailEmployeur;