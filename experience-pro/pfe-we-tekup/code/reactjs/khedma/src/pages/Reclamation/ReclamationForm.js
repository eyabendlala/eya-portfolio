import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecruiterNavbar from '../../components/RecruiterNavbar';
import Navbar from '../../components/Navbar';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { connect } from 'react-redux';
import './ReclamationForm.css'; 

// export const baseURL = 'http://127.0.0.1:8000';

const ReclamationForm = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();   
  const [reclamation, setReclamation] = useState({ subject: '', description: '', status: 'open' });

  useEffect(() => {
    if (id) {

      axios.get(`/reclamations/${id}/`)
        .then(response => {
          setReclamation(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the reclamation!', error);
        });
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestData = { ...reclamation, user_id: user.id }; // Include user_id in the request data

    const request = id
      ? axios.put(`/reclamations/${id}/update/`, requestData)
      : axios.post(`/reclamations/`, requestData);

    request
      .then(() => {
        navigate('/recruteur/reclamation');
      })
      .catch(error => {
        console.error('There was an error saving the reclamation!', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReclamation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  return (
        <div className="site-wrap">
         <Navbar></Navbar>
  <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-white font-weight-bold">Espace Recruteur</h1>
            <div className="custom-breadcrumbs">
              <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
              <span className="text-white"><strong>Ajout Réclamation </strong></span>
            </div>
          </div>
        </div>
      </div>
   </section>
   <RecruiterNavbar />
    
    <div className="claim-form-container" >
      <h1>{id ? 'Modifier Reclamation' : 'Ajouter Reclamation'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject</label>
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
        <button type="submit">Save</button>
      </form>
    </div>




    </div>
  );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
  });
  
  export default connect(mapStateToProps)(ReclamationForm);