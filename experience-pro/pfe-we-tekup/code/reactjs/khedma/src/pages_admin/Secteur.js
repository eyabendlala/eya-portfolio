import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from "../hocs/AdminLayout";
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import './Secteur.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



const SecteurComponent = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [secteurId, setSecteurId] = useState(null);
  const [parent, setParent] = useState('');


  useEffect(() => {
    fetchSecteurs();
  }, []);

  const fetchSecteurs = async () => {
    const response = await axios.get('/secteurs/');
    setSecteurs(response.data);
  };

  const handleCreate = async () => {
    const newSecteur = { nom, description, parent: parentId || null };
    await axios.post('/secteurs/create/', newSecteur);
    fetchSecteurs();
    setNom('');
    setDescription('');
    setParentId('');
  };


  const handleUpdate = async () => {
    const updatedSecteur = { nom, description, parent: parentId || null };
    await axios.put(`/secteurs/update/${secteurId}/`, updatedSecteur);
    fetchSecteurs();
    setSecteurId(null);
    setNom('');
    setDescription('');
    setParentId('');
  };



  const handleDelete = async (id) => {
    await axios.delete(`/secteurs/delete/${id}/`);
    fetchSecteurs();
  };

    const resetForm = () => {
        setSecteurId(null);
        setNom('');
        setDescription('');
        setParent('');
      };

  return (

    <AdminLayout>
      <Row className='justify-content-md-center mt-4'>
        <Col md={5}>
          <h2>{secteurId ? 'Modifier un Secteur' : 'Ajouter un Secteur'}</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom du secteur</Form.Label>
              <Form.Control 
                type="text" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez le nom" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description" 
              />
            </Form.Group>

        
            <center className="mt-3">

            <Button className="mt-4" variant="primary" style={{width:'150px', borderRadius:'15px' ,marginRight:'20px'}} onClick={secteurId ? handleUpdate : handleCreate}>
              {secteurId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            <Button className="mt-4" variant="secondary" onClick={resetForm} style={{width:'150px', borderRadius:'15px'}}>
              Réinitialiser
            </Button>

            </center>


          </Form>
        </Col>

        <Col md={6}>
  <h2>Liste des Secteurs</h2>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {secteurs.map((secteur, index) => (
        <tr key={secteur.id}>
          <td>{index + 1}</td>
          <td>{secteur.nom}</td>
          <td>{secteur.description}</td>
           


          <td>
  <FontAwesomeIcon 
    icon={faEdit} 
    style={{ cursor: 'pointer', marginRight: '10px', color: 'skyblue' }} // Changement de couleur ici
    onClick={() => {
      setSecteurId(secteur.id);
      setNom(secteur.nom);
      setDescription(secteur.description);
    }} 
  />
  <FontAwesomeIcon 
    icon={faTrash} 
    style={{ cursor: 'pointer', color: 'gray' }} // Changement de couleur ici
    onClick={() => handleDelete(secteur.id)} 
  />
</td>  
        </tr>
      ))}
    </tbody>
  </Table>
</Col>
      </Row>
    </AdminLayout>

  );
};

export default SecteurComponent;
