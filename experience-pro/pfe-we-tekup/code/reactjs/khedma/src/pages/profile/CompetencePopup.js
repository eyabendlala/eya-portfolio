import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ajoutercompetenceuser, geAllCompetences } from '../../actions/auth.js';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

Modal.setAppElement('#root');

const CompetencePopup = ({ ajoutercompetenceuser, isOpen, onClose, onCompetenceSelect, selectedCompetences, id }) => {
    const [competences, setCompetences] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [displayedCompetences, setDisplayedCompetences] = useState([]);
    const [allCompetences, setAllCompetences] = useState([]);

    useEffect(() => {
        const fetchCompetences = async () => {
            try {
                const response = await geAllCompetences();
                const data = response.data;

                // Limitez les compétences affichées à 10 par défaut
                const defaultCompetences = data.slice(0, 6);
                setCompetences(defaultCompetences);

                // Stockez toutes les compétences dans l'état pour la recherche
                setAllCompetences(data);
            } catch (error) {
                alert(error);
            }
        };

        fetchCompetences();
    }, []);

    useEffect(() => {
        // Filtrer les compétences en fonction du texte de recherche
        const filtered = allCompetences.filter(competence =>
            competence.nom.toLowerCase().includes(searchText.toLowerCase())
        );

        // Limiter l'affichage à 10 compétences au maximum
        setDisplayedCompetences(filtered.slice(0, 6));
    }, [allCompetences, searchText]);

    const onSubmitForm = async (event) => {
        event.preventDefault();
        try {
            const data = {
                user_id: id,
                competences: selectedCompetences
            };

            const response = await ajoutercompetenceuser(data);

            if (response) {
                toast.success('🦄 Vous avez ajouté des compétences avec succès!', {
                    position: "top-center",
                    autoClose: 2000,
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
        <Modal isOpen={isOpen} onRequestClose={onClose} className="competence-popup-modal" overlayClassName="competence-popup-overlay">
            <div className="competence-popup">
                <form onSubmit={onSubmitForm}>
                    <div className='align-items-center'>
                        <h4 style={{marginLeft:"30px",color:"#2DAAE1"}}>Choisir votre Compétences</h4>
                    </div>
                    
                    <div className='containersearch'>
                        <input
                            type="text" className='rechercheinput'
                            placeholder="Entrer une compétence"
                            value={searchText}
                            style={{background:"#2DAAE1"}}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className='search'></div>
                    </div>
                    
                    <div className="modal-content">
                        <div className="competences-container">
                            {displayedCompetences.map((competence) => (
                                <div
                                    key={competence.id}
                                    className={`competence-boxpopup ${selectedCompetences.includes(competence.id) ? 'selected' : ''}`}
                                    onClick={() => onCompetenceSelect(competence.id)}
                                >
                                    {selectedCompetences.includes(competence.id) && (
                                        <FontAwesomeIcon icon={faCheck} className="tick-icon" />
                                    )}
                                    {competence.nom}
                                </div>
                            ))}
                        </div>
                    </div>
                    <br />
                    <button type="button" onClick={onSubmitForm} className='btnpopup'>ajouter compétence</button>&nbsp;&nbsp;
                    <button type='button' onClick={onClose} className='btnpopup'>Fermer</button>
                </form>
            </div>
        </Modal>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    personne: state.auth.user && state.auth.user.personne,
    id: state.auth.user && state.auth.user.id,
});

export default connect(mapStateToProps, { ajoutercompetenceuser })(CompetencePopup);
