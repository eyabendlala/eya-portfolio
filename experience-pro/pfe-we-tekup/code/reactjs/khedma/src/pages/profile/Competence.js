import React,{useEffect, useState} from 'react';
import { geAllCompetences,load_user,ajoutercompetenceuser } from '../../actions/auth.js';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Competence = ({ ajoutercompetenceuser,id, onCompetenceSelect, selectedCompetences = []}) => {
    const [competences, setCompetences] = useState([]);
    //console.log("personne id",id);
    useEffect(() => {
        const fetchCompetences = async () => {
        try {
            const response = await geAllCompetences();
            const data = response.data;
            setCompetences(data);
        } catch (error) {
            alert(error);
        }
    };

    fetchCompetences();
  }, []);
  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user_id', id);
      //console.log('competence select ons',selectedCompetences);
      formData.append('competences', JSON.stringify(selectedCompetences)); // Use JSON.stringify to send the array
  
      const response = await ajoutercompetenceuser(formData);
  
      if (response) {
        toast.success('🦄 Vous avez ajouté compétences au user avec succès!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  
  


  return (
    
      <div className="competence-popup">
      <form onSubmit={onSubmitForm}>
          <h2>Choose Competences</h2>
          <div className="modal-content">
            {competences.map((competence) => (
              <div
                key={competence.id}
                className={`competence-box ${selectedCompetences.includes(competence.id) ? 'selected' : ''}`}
                onClick={() => onCompetenceSelect(competence.id)}
              >
                {selectedCompetences.includes(competence.id) && (
                  <FontAwesomeIcon icon={faCheck} className="tick-icon" />
                )}
                {competence.nom}
              </div>
            ))}
          </div>
          <button type="button" onClick={onSubmitForm} className='btnpopup'>ajouter compétence</button>


        </form>
        
      </div>

    
  );
};
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    personne: state.auth.user && state.auth.user.personne,
    id: state.auth.user && state.auth.user.id, // Add this line to get the id
  });
//   const mapDispatchToProps = (dispatch) => {
//     return {
//       loadUser: () => dispatch(load_user())
//     };
//   };
  
  export default connect(mapStateToProps,{ajoutercompetenceuser})(Competence);
