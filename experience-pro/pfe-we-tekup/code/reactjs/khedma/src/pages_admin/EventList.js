import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Table, Pagination, Button, FormGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArchive, faArrowLeft, faArrowRight, faFileArchive, faCheck, faTimes, faShare, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from "../hocs/AdminLayout";
import './EventList.css'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';
import Modal from 'react-bootstrap/Modal';


const EventList = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [currentEventDescription, setCurrentEventDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/event-list/');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);


 
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleEditEvent = (eventId) => {
        navigate(`/admin/UpdateEventAd/${eventId}`);
    };

    const deleteEvent = async (eventId) => {
        
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
        if (confirmDelete) {
        //  console.log('Deleting event with ID:', eventId);
       try {       
          const response = await axios.delete(`/delete-event/${eventId}/`);
        //   console.log('Event deleted successfully');
          setEvents(events.filter(event => event.id !== eventId));
    
          toast.success('Événement supprimé avec succès !', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            className: "toast-light-blue",
            icon: <i className="fas fa-check-circle toast-icon-blue"></i>
    
          });    } catch (error) {
          console.error('Error deleting event:', error);
          toast.error('Erreur lors de la suppression de l\'événement');
        }
    }
      };
    

      const publieEvent = async (eventId) => {
        try {
            // Assurez-vous que l'URL corresponde au chemin défini dans votre fichier urls.py
            const response = await axios.put(`/publie-event/${eventId}/`);    
            // console.log('Réponse:', response.data);
            toast.success(response.data.message);
            window.location.reload()
        } catch (error) {
            console.error('Erreur lors de la publication/cachage de l’événement:', error);
            toast.error('Erreur lors de la publication/cachage de l’événement.');
        }
    };


const archiverEvent = async (eventId) => {
    try {
      const response = await axios.put(`/archiver-event/${eventId}/`);
      toast.success(response.data.message);
      window.location.reload()

      
    } catch (error) {
      console.error("Erreur lors de l'archivage de l'événement:", error);
      toast.error("Erreur lors de l'archivage de l'événement.");
    }
  };


      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
       event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.secteurs_noms && event.secteurs_noms.some(secteur => secteur.toLowerCase().includes(searchQuery.toLowerCase())))||
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
);

const openDescriptionModal = (description) => {
    setCurrentEventDescription(description);
    setShowDescriptionModal(true);
  };
  const handleCloseModal = () => {
    setShowDescriptionModal(false);
    };
   
    return (
        <AdminLayout>
             <Row>
                <Col md={12}>
                    <center><FormGroup>
                        <FormControl
                            type="text"
                            placeholder="Rechercher par titre, lieu ou secteur"
                            className="mt-3"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </FormGroup></center>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Table striped bordered hover responsive className="mt-4">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Date</th>
                                <th>Lieu</th>
                                <th>Prix</th>
                                <th>Description</th>
                                <th>Expiration</th>
                                <th>Secteur</th>
                                <th style={{ textAlign: 'center' }}>Publié</th>
                                <th style={{ textAlign: 'center' }}>Archivé</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => (
                                <tr key={index}>
                               <td>
                                 <div className="scrollable-horizontal">
                                   {event.title}
                                 </div>
                                </td> 
                                    <td>{new Date(event.date).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{event.location}</td>
                                    <td>{event.price}</td>
                                    
                                    <td>
                                      <div className="table-cell-centered">
                                          <Button variant="link" onClick={() => openDescriptionModal(event.description_event)} style={{ color: 'gray', textAlign: 'center' }} className="button-text-action">Explorer</Button>
                                      </div>
                                    </td>

                                    <td>{new Date(event.date_expiration).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                    {event.secteurs_noms && event.secteurs_noms.length > 0 ? event.secteurs_noms.join(', ') : 'Non spécifié'}</td>

                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    { event.is_active === true ? (
                                        <FontAwesomeIcon icon={faCheck} style={{color:'#3f8222',fontSize: '27px'}} title="Publié" />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{color:'#b7271d',fontSize: '27px'}} title="Non publié"  />
                                    )
                                    }
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    { event.is_archived === true ? (
                                        <FontAwesomeIcon icon={faFileArchive} style={{color:'black', fontSize: '27px'}} title="Archivé"  />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{color:'#b7271d', fontSize: '27px'}} title="Non archivé"  />
                                    )
                                    }
                                    </td>

                                    <td>
                                    <div className="d-flex justify-content-around">

                                        <Button variant="info" onClick={() => handleEditEvent(event.id)} className="Button-icon-only Button-edit small-btn "><FontAwesomeIcon icon={faEdit} /></Button>
                                          
                                        <Button variant="danger" onClick={() => deleteEvent(event.id)} className=" Button-icon-only Button-delete small-btn mx-2"><FontAwesomeIcon icon={faTimes} /></Button>

                                        <Button onClick={() => publieEvent(event.id)} className="Button-icon-only Button-edit small-btn mx-2" title="Publié"> <FontAwesomeIcon icon={faShare} /></Button>

                                        <Button variant="secondary" onClick={() => archiverEvent(event.id)} className="Button-icon-only Button-archive small-btn mx-2">
                                        <FontAwesomeIcon icon={event.is_archived ? faBoxOpen : faArchive} title={event.is_archived ? "Désarchiver" : "Archiver"} />
                                        </Button>

                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Col md={12} className="mt-5">
                    <Pagination className="pagination-styles ">
                      <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {Array.from({ length: Math.ceil(events.length / eventsPerPage) }, (_, i) => (
                      <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                        {i + 1}
                       </Pagination.Item>
                          ))}
                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(events.length / eventsPerPage)} />
                     <Pagination.Last onClick={() => paginate(Math.ceil(events.length / eventsPerPage))} disabled={currentPage === Math.ceil(events.length / eventsPerPage)} />
                    </Pagination>
                    </Col>
                </Col>
            </Row>
            <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} size="lg">
               <Modal.Header>
                   <Modal.Title>Description de l'événement</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentEventDescription) }} />
               </Modal.Body>
               <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
           </Modal>
        </AdminLayout>
    );
};

export default EventList;