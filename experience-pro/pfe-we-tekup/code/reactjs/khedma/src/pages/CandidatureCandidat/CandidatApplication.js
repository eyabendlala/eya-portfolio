import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import '../EspaceRecruteur/Candidatures.css';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import Navbar from '../../components/Navbar';
import CandidatNavbar from '../../components/CandidatNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import DetailsCandidature from './DetailsCandidature'; 

  // export const baseURL = 'http://127.0.0.1:8000';


const CandidatApplication = ({ user }) => {
    const [candidatApplications, setCandidatApplications] = useState([]);
    const navigate = useNavigate();

//serch application
const [searchJobTitle, setSearchJobTitle] = useState('');
const [searchStatus, setSearchStatus] = useState('');
const [searchResults, setSearchResults] = useState([]);
 const [selectedApplicationId, setSelectedApplicationId] = useState(null);




  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const handleCloseDetails = () => {
    setSelectedApplicationId(null);
  };

    useEffect(() => {
      if (user && user.id) {

        axios.get(`/api/candidat/applications/?candidat=${user.id}`)
            .then(response => {
                console.log("Applications fetched successfully:", response.data);
                setCandidatApplications(response.data);
            })
            .catch(error => {
                console.error("Il y a eu une erreur!", error);
            });
          }
    }, [user]);


    const getStatusFromText = (text) => {
      switch (text.toLowerCase()) {
        case 'non traité':
          return 'pending'; 
        case 'accepté':
          return 'accepted';
        case 'rejeté':
          return 'rejected';
        default:
          return text; 
      }
    };
  // Fonction pour mettre à jour les résultats de recherche
  useEffect(() => {
    let filteredCandidatures = candidatApplications.filter(application => {
      const searchJobTitleLower = searchJobTitle.toLowerCase();
      const searchStatusLower = getStatusFromText(searchStatus).toLowerCase();
  
      const jobTitleMatch = application.titre.toLowerCase().includes(searchJobTitleLower);
      const statusMatch = getStatusText(application.status).toLowerCase().includes(searchStatusLower);
      return jobTitleMatch && statusMatch;
    });
    setSearchResults(filteredCandidatures);
  }, [candidatApplications, searchJobTitle, searchStatus]);
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Non traité';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };




return (
  <div >
  <div className={`candidature1-container ${selectedApplicationId ? 'blurred' : ''}`}>
 <Navbar></Navbar>
  <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-white font-weight-bold">Espace Candidat</h1>
            <div className="custom-breadcrumbs">
              <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
              <span className="text-white"><strong>Mes Candidatures</strong></span>
            </div>
          </div>
        </div>
      </div>
   </section>
   <CandidatNavbar /> 
 
 
   <div className="search11-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Rechercher par titre emploi..."
            value={searchJobTitle}
            onChange={(e) => setSearchJobTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rechercher par statut de candidature..."
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          />
        </form>
      </div>
      {searchResults.length > 0 ? (
                    searchResults
        .sort((a, b) => {
          // Order: Non traité (pending), Accepté (accepted), Rejeté (rejected)
          const order = ['pending', 'accepted', 'rejected'];
          return order.indexOf(a.status.toLowerCase()) - order.indexOf(b.status.toLowerCase());
        })
        .map((application) => (
          <div key={application.id} className="candidature1-item">
        <p className="nom-du-candidat">{application.titre}</p>
        <p>Date de candidature: {new Date(application.applied_on).toLocaleDateString()}</p>
        <p className={`status ${application.status.toLowerCase()}`}>
          Status: {getStatusText(application.status)}
        </p> 
        <button className="details-button" onClick={() => handleViewDetails(application.id)}>Voir les détails</button> 
     </div>
))

) : (
  <p>Aucune candidature trouvée pour le poste sélectionné.</p>
)}

</div>
{selectedApplicationId && (
     <div className="societe-details-overlay"> 
        <div >
          <button onClick={handleCloseDetails} className="close-buttonn">
              <FontAwesomeIcon icon={faTimes} />
          </button>
          <DetailsCandidature applicationId={selectedApplicationId} />
        </div>
        </div>
      )}
</div>


);
};

// export default CandidatApplication;

const mapStateToProps = (state) => {
   
  
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user, 
        role: state.auth.user && state.auth.user.role,
        id: state.auth.user && state.auth.user.id,
    };
  };

export default connect(mapStateToProps)(CandidatApplication);

