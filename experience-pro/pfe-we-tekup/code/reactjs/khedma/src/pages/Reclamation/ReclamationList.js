import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import RecruiterNavbar from '../../components/RecruiterNavbar';
import Navbar from '../../components/Navbar';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

import './ReclamationList.css'; 

// export const baseURL = 'http://127.0.0.1:8000';

const ReclamationList = ({ user }) => {
  const [reclamations, setReclamations] = useState([]);
  //Ajout réclamation
  const [reclamation, setReclamation] = useState({ subject: '', description: '', status: 'open' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

  const [editingReclamationId, setEditingReclamationId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // État pour suivre le mode édition

  const [showModal, setShowModal] = useState(false); 
  const [selectedReclamation, setSelectedReclamation] = useState(null); 

  useEffect(() => {
    if (user && user.id) {

    // axios.get(`${baseURL}/reclamations/list/`)
    axios.get(`/reclamations/list/?recruteur=${user.id}`)

      .then(response => {
        setReclamations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the reclamations!', error);
      });
    }
  }, [user]);




  const handleSubmit = (event) => {
    event.preventDefault();

    const requestData = { ...reclamation, user_id: user.id }; // Include user_id in the request data

    const request = isEditing
      ? axios.put(`/reclamations/${editingReclamationId}/update/`, requestData)
      : axios.post(`/reclamations/`, requestData);

      request
      .then(response => {
        // Update the reclamations list with the new or updated reclamation
        if (isEditing) {
          // If we're updating an existing reclamation, find and replace it
          setReclamations(prevReclamations =>
            prevReclamations.map(r =>
              r.id === editingReclamationId ? response.data : r
            )
          );
          toast.success('La réclamation a été modifiée avec succès', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          });
        } else {
          // If we're adding a new reclamation, append it to the list
          setReclamations(prevReclamations => [...prevReclamations, response.data]);
          toast.success('La réclamation a été ajoutée avec succès', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          });
        }
  
        // Optionally clear the form after submission
        setReclamation({ subject: '', description: '', status: 'open' });
        setShowForm(false);
        setIsEditing(false);
        setEditingReclamationId(null);  
        // Optionally hide the form or navigate away
        navigate('/recruteur/reclamation'); // Or setShowForm(false) if you want to hide the form
      })
      .catch(error => {
        console.error('There was an error saving the reclamation!', error);
      }); 
      setIsEditing(false); // Revenir à l'état initial après l'enregistrement
    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReclamation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const toggleForm = () => {
    setShowForm(prevState => !prevState); // Toggle form visibility
  };

  const handleEditReclamation = (id) => {
    // Pre-populate the form with the data of the reclamation to be edited
    axios.get(`/reclamations/${id}/`)
          

      .then(response => {
        setReclamation(response.data);
        setShowForm(true);
        setIsEditing(true); // Mettre à jour l'état pour passer en mode édition
        setEditingReclamationId(id); // Mettre à jour l'état avec l'id de la réclamation 


      })
      .catch(error => {
        console.error('There was an error fetching the reclamation to edit!', error);
      });
  };

   // Delete function
   const handleDeleteReclamation = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
    axios.delete(`/reclamations/${id}/delete/`)        
      .then(() => {
          setReclamations(prevReclamations => prevReclamations.filter(r => r.id !== id));
          toast.success('La réclamation a été supprimée avec succès', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          });
        })
        .catch(error => {
          console.error('There was an error deleting the reclamation!', error);
          toast.error('La suppression de la réclamation a échoué', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 4000
          });
        });
    }
  };

  const openModal = (id) => {
    axios.get(`/reclamations/${id}/`)
      .then(response => {
        setSelectedReclamation(response.data);
        setShowModal(true);
      })
      .catch(error => {
        console.error('There was an error fetching the reclamation details!', error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReclamation(null);
  };

  return (
    <div >
         <Navbar></Navbar>
  <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-white font-weight-bold">Espace Recruteur</h1>
            <div className="custom-breadcrumbs">
              <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
              <span className="text-white"><strong> Réclamation </strong></span>
            </div>
          </div>
        </div>
      </div>
   </section>
   <RecruiterNavbar />
   <div className="reclamation-container">
        <div className="reclamation-list-wrapper">
          <div className="header-container">
            <h1 className="reclamation-list-header">Réclamations</h1>
          </div>
          <ul className="reclamation-list">
            {reclamations.map(reclamation => (
              <li key={reclamation.id}>
                <Link to="#" onClick={() => openModal(reclamation.id)}>{reclamation.subject}</Link>
                <div className="action-buttons">
                  <button onClick={() => handleDeleteReclamation(reclamation.id)} className="Button-icon-onlyyy Button-delete small-btnn">
                    <FontAwesomeIcon icon={faTrash} />
                 </button>
                 <button onClick={() => handleEditReclamation(reclamation.id)} className="Button-icon-onlyyy Button-edit small-btnn ">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
              </li>
            ))}

          </ul>
          {/* <Link to="/recruteur/reclamations/new" className="create-reclamation-button">Create New Reclamation</Link> */}
          <button onClick={toggleForm} className="create-reclamation-button">Ajouter Reclamation</button>

        </div>
        {showForm && (
        <div className="claim-form-container">
            <h1>{isEditing ? 'Modifier Reclamation' : 'Ajouter Reclamation'}</h1>
            <form onSubmit={handleSubmit}>
            <div>
              <label>Sujet</label>
              <input
                type="text"
                name="subject"
                value={reclamation.subject}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={reclamation.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Status</label>
              <select
                name="status"
                value={reclamation.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
            </form>
        </div>
        )}

{selectedReclamation && (
  <Modal
    isOpen={showModal}
    onRequestClose={closeModal}
    contentLabel="Reclamation Details Modal"
    className="custom-modal"
    overlayClassName="custom-overlay"
    style={{
      content: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: 'auto',
        minHeight: '55vh',
        maxWidth: '50%',
        maxHeight: '70vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  >
    <h4>{selectedReclamation.subject}</h4>
    <div className="scrollable-fields" style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
      <p><strong>Description:</strong> {selectedReclamation.description}</p>
      <p><strong>Status:</strong> {selectedReclamation.status}</p>
      
    </div>
    <button onClick={closeModal} className="btn btn-primary" style={{ alignSelf: 'center', marginTop: 'auto' }}>Close</button>
  </Modal>
)}





      </div>
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
  });
  
  export default connect(mapStateToProps)(ReclamationList);


