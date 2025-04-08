import React, { useState, useEffect } from 'react';
import { faUser, faGear, faRightFromBracket, faStar, faLock, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getPersonneParId, load_user,geCompetencesByPerson } from '../../actions/auth';

import { modifierPersonne } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import CryptoJS from 'crypto-js';
function DetailPersonne() {
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
  const [cv,setCv]=useState('');
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
          setCv(data.personne.cv);
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
        <div className="container light-style flex-grow-1 container-p-y body">
        <h4 className="font-weight-bold py-3 mb-4">Détail du personne</h4>
        <div className="card overflow-hidden">
          <div className="row no-gutters row-bordered row-border-light">
            <div className="col-md-3 pt-0">
              <div className="list-group list-group-flush account-settings-links">
                <a className={`list-group-item list-group-item-action ${activeTab === 'account-general' ? 'active' : ''}`} onClick={() => handleTabClick('account-general')}>
                  <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;Information Personnel
                </a>
                {/* <a className={`list-group-item list-group-item-action ${activeTab === 'account-info' ? 'active' : ''}`} onClick={() => handleTabClick('account-info')}>
                  <FontAwesomeIcon icon={faStar} /> &nbsp;&nbsp;Evaluations
                </a> */}
              </div>
            </div>
            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 'account-general' ? 'active show' : ''}`} id="account-general">
                    <form encType="multipart/form-data">
                    <div className="card-body media align-items-center">
                    <img src={image} alt="Profile" className="d-block ui-w-80" />
                    </div>
                <hr className="border-light m-0" />
                <div className="card-body">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 soustitres">
                        <h4 className="mb-2 ">Détail personnel</h4>
                    </div>
                    <hr className="border border-1" style={{color:"black"}}></hr>
                    <div className='row'>
                      <div className='form-group'>
                        &nbsp;&nbsp;<label htmlFor='titreduprofil'>Titre du profil</label>
                        &nbsp;&nbsp;<input type='text' className="form-control" id="titreduprofil" value={titreduprofil} onChange={(e) => setTitrduprofil(e.target.value)} readOnly />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="fullName">Nom</label>
                          <input type="text" className="form-control" id="nom"  value={nom} onChange={(e) => setNom(e.target.value)}  readOnly/>

                        </div>
                      </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="eMail">Prénom</label>
                        <input type="text" className="form-control" id="prénom"  value={prenom} onChange={(e) => setPrenom(e.target.value)} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="phone">Genre</label>
                        <input type="text" className="form-control" id="genre"  value={genre} onChange={(e) => setGenre(e.target.value)} readOnly/>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="website">Date de naissance</label>
                        <input type="date" id="date_naissance" className="form-control"  name='date_naissance' value={date_naissance} onChange={(e) => setDate_naissance(e.target.value)} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="phone">Adresse</label>
                        <input type="text" className="form-control" id="adresse"  value={adresse} onChange={(e) => setAdresse(e.target.value)} readOnly />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="website">Nationnalité</label>
                        <input type="text" className="form-control" id="natinalite" value={nationalite} onChange={(e) => setNationalite(e.target.value)} readOnly />
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
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
                        </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                        <label for="zIp">Numéro téléphone</label>
                        <input type="text" className="form-control" id="numer_telephone"  value={numero_telephone} onChange={(e) => setNumero_telephone(e.target.value)} readOnly/>
                        </div>
                        
                     </div>
                    
                </div>
                {cv && (
                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 soustitres">
                      <h4 className="mt-3 mb-2">Télécharger le CV</h4>
                      <hr className="border border-1 custom-hr" />
                      <div>
                        <a href={cv} target="_blank" className="btn btn-primary" id="btntelecharger" rel="noopener noreferrer">
                          Télécharger le CV
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {competences && Array.isArray(competences) && competences.length > 0 ? (
                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 soustitres">
                      <h4 className="mt-3 mb-2">Compétences</h4>
                      <hr className="border border-1 custom-hr" /> 
                      <div className="competences-container">
                        {competences.map((competence) => (
                          <div className="competence-box" key={competence.id}>
                            {competence.nom}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                    <br/><br/><br/>
                </form>

                </div>
               
                <div className={`tab-pane fade ${activeTab === 'account-info' ? 'active show' : ''}`} id="account-info">
                <div className="card-body pb-2">
                    <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc arcu, dignissim sit amet sollicitudin iaculis, vehicula id urna. Sed luctus urna nunc. Donec fermentum, magna sit amet rutrum pretium, turpis dolor molestie diam, ut lacinia diam risus eleifend sapien. Curabitur ac nibh nulla. Maecenas nec augue placerat, viverra tellus non, pulvinar risus.</textarea>
                    </div>
                    <div className="form-group">
                    <label className="form-label">Birthday</label>
                    <input type="text" className="form-control" value="May 3, 1995" />
                    </div>
                    <div className="form-group">
                    <label className="form-label">Country</label>
                    <select className="custom-select">
                        <option>USA</option>
                        <option selected>Canada</option>
                        <option>UK</option>
                        <option>Germany</option>
                        <option>France</option>
                    </select>
                    </div>
                </div>
                <hr className="border-light m-0" />
                <div className="card-body pb-2">
                    <h3 className="mb-4">Contacts</h3>
                    <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" value="+0 (123) 456 7891" />
                    </div>
                    <div className="form-group">
                    <label className="form-label">Website</label>
                    <input type="text" className="form-control" value="" />
                    </div>
                </div>
                </div>
               
                
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}
export default DetailPersonne;