import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from "../hocs/AdminLayout";
import { Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import './AdminReclamation.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logo from './images/notificationLogo.png'; // Adjust the path as needed



// export const baseURL = 'http://127.0.0.1:8000';

const AdminReclamation = () => {
    const [reclamations, setReclamations] = useState([]);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReclamations();
    }, []);

    const fetchReclamations = async () => {
        try {
            const response = await axios.get(`/api/reclamations/list/`); 

            setReclamations(response.data);
        } catch (error) {
            console.error('Error fetching reclamations:', error);
        }
    };

    const handleReclamationClick = (reclamation) => {
        setSelectedReclamation(reclamation);
        setStatus(reclamation.status);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReclamation(null);
    };

    const handleUpdateReclamation = async () => {
        try {
            await axios.put(`/reclamations/${selectedReclamation.id}/update/`, { status });
            fetchReclamations();
            handleCloseModal();
        } catch (error) {
            console.error('Error updating reclamation:', error);
        }
    };

    const handleDeleteReclamation = async (reclamationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
            try {
                await axios.delete
                (`/reclamations/${reclamationId}/delete/`);
                fetchReclamations(); 
                toast.success('Réclamation supprimée avec succès !', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 4000
                  });

            } catch (error) {
                console.error('Error deleting reclamation:', error);
                toast.error('Erreur lors de la suppression de la réclamation.');
            }
        }
    };
 
    const generateExcel = () => {
        // Fetch the data from the table
        const table = document.getElementById('reclamationTable');
        const headers = ['ID', 'Sujet', 'Description', 'Status', 'Date de soumission'];
    
        // Prepare data for Excel
        const data = Array.from(table.querySelectorAll('tbody tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
        });
    
        // Remove actions column from data
        const filteredData = data.map(row => row.slice(0, -1)); // Remove actions cells
    
        // Create a new workbook and add a worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...filteredData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Réclamations');
    
        // Generate Excel file and trigger download
        XLSX.writeFile(wb, 'reclamations_rapport.xlsx');
       
        toast.success('Excel téléchargé avec succès !', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 4000,
        });
    };

const generatePDF = () => {
    // Fetch the data for the PDF
    const table = document.getElementById('reclamationTable');
    const headers = ['ID', 'Sujet', 'Description', 'Status', 'Date de soumission'];

    // Prepare data for pdf
    const data = Array.from(table.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
    });

    // Remove actions column from data and headers
    const filteredHeaders = headers.slice(0, -1); // Remove 'Actions'
    const filteredData = data.map(row => row.slice(0, -1)); // Remove actions cells

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set the title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Rapport des Réclamations', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Add the table
    pdf.autoTable({
        startY: 30, // Start position of the table
        head: [filteredHeaders],
        body: filteredData,
        margin: { left: 10, right: 10 },
        styles: {
            fontSize: 10,
            cellPadding: 2,
            overflow: 'linebreak', // Ensures text wraps within cell
            valign: 'middle',
            halign: 'center',
        },
        columnStyles: {
            2: { cellWidth: 'auto', textColor: [0, 0, 0] }, // Adjust column width and text color if needed
        },
        didDrawPage: (data) => {
            // Optionally add header/footer on each page
            pdf.setFontSize(10);
            pdf.text('Page ' + String(pdf.internal.getNumberOfPages()), 190, 285);
        },
    });

    // Save the PDF
    pdf.save('reclamations_rapport.pdf');
    toast.success('PDF téléchargé avec succès !', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 4000,
    });
};

    

    return (
        <div className="reclamation-page">

        <AdminLayout>
            <Row className="justify-content-md-center mt-4">
                <Col md={10}>
                    <h2>Gestion des Réclamations</h2>
                    
                    <Table id="reclamationTable" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Société</th>
                                <th>Sujet</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date de soumission</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reclamations.map((reclamation) => (
                                <tr key={reclamation.id}>
                                    <td> {reclamation.user_details.nom} {reclamation.user_details.prenom}  </td>
                                    <td>{reclamation.subject}</td>
                                    <td> <div className="description-container">
                                      {reclamation.description}
                                   </div></td>
                                    <td>{reclamation.status}</td>
                                    <td>{new Date(reclamation.created_at).toLocaleDateString()}</td>
                                    <td>
                                    <Button variant="primary" className="icon-claim" onClick={() => handleReclamationClick(reclamation)}>
                                       <FontAwesomeIcon icon={faEye} /> 
                                    </Button>{' '}
                                    <Button variant="danger" className="icon-claim" onClick={() => handleDeleteReclamation(reclamation.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>  
   
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        
                    </Table>


                    <div className="button-container">
  <Button className="custom-button" onClick={generatePDF}>
    Télécharger le rapport PDF
  </Button>
  <Button className="custom-button" onClick={generateExcel}>
    Télécharger le rapport Excel
  </Button>
</div>



                </Col>
            </Row>

            {selectedReclamation && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails de la Réclamation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>{selectedReclamation.subject}</h4>
                        <p><strong>Description:</strong> {selectedReclamation.description}</p>
                        <hr />
            {selectedReclamation.user_details && (
                <>
                    <h5 style={{ textAlign: 'center' }}>Informations de l'utilisateur</h5>
                    <p><strong>Nom:</strong> {selectedReclamation.user_details.nom} {selectedReclamation.user_details.prenom}</p>
                    <p><strong>Email:</strong> {selectedReclamation.user_details.email}</p>
                    <p><strong>Téléphone:</strong> {selectedReclamation.user_details.numero_telephone}</p>
                </>
            )}
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Ouverte">Ouverte</option>
                                <option value="En cours">En cours</option>
                                <option value="Résolue">Résolue</option>
                                <option value="Fermée">Fermée</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fermer
                        </Button>
                        <Button variant="primary" onClick={handleUpdateReclamation}>
                            Mettre à jour
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </AdminLayout>
                </div>

    );
};

export default AdminReclamation;
