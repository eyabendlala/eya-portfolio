import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './CategoriePopup.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');


const CategoriePopup = ({ isOpen, onClose, oncategorieselect, selectedcategories}) => {
    const [categories, setcategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [displayedcategories, setDisplayedcategories] = useState([]);
    const [allcategories, setAllcategories] = useState([]);

    useEffect(() => {
        const fetchcategories = async () => {
            try {
                const response = await axios.get("/get-categories");
                const data = response.data;
                
                setcategories(data);
                setAllcategories(data);
            } catch (error) {
                alert(error);
            }
        };

        fetchcategories();
    }, []);

    useEffect(() => {
        // Filtrer les compétences en fonction du texte de recherche
        const filtered = allcategories.filter(categorie =>
            categorie.nom.toLowerCase().includes(searchText.toLowerCase())
        );

        // Limiter l'affichage à 10 compétences au maximum
        setDisplayedcategories(filtered);
    }, [allcategories, searchText]);


    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="categorie-popup-modal" overlayClassName="categorie-popup-overlay">
            <div className="categorie-popup">
                <form>
                    <div className='align-items-center'>
                        <h4 style={{marginLeft:"30px",color:"#2DAAE1"}}>Choisir votre Catégorie</h4>
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
                        <div className="categories-container">
                            {displayedcategories.map((categorie) => (
                                <div
                                    key={categorie.id}
                                    className={`categorie-boxpopup ${selectedcategories.includes(categorie.id) ? 'selected' : ''}`}
                                    onClick={() => oncategorieselect(categorie.id)}
                                >
                                    {selectedcategories.includes(categorie.id) && (
                                        <FontAwesomeIcon icon={faCheck} className="tick-icon" />
                                    )}
                                    {categorie.nom}
                                </div>
                            ))}
                        </div>
                    </div>
                    <br />
                    <button type="button" className='btnpopup'>ajouter compétence</button>&nbsp;&nbsp;
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

export default connect(mapStateToProps)(CategoriePopup);