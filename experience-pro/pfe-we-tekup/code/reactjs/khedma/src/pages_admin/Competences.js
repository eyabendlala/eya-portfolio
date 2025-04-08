import AdminLayout from "../hocs/AdminLayout";
import {React, useState, useEffect} from "react";
import {Row, Col, Form, FormGroup, FormControl, Button, Table} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';

const Competences = () => {
    const [competences, setCompetences] = useState();
    const [id, setId] = useState()

    const [nom, setNom] = useState()
    const [nomError, setNomError] = useState('Ce champ est obligatoire.')

    const [button, setButton] = useState('Ajouter')
    

    useEffect(() => {
        const fetchCompetences = async () => {
        try {
            const response = await axios.get('/competence/');
            setCompetences(response.data);
        } catch (error) {
            console.error('Error fetching competences:', error);
        }
        };
        fetchCompetences();
    }, []);

    useEffect(() =>{
        if (nom !== undefined){
            if (nom.length === 0){
                setNomError('Ce champ est obligatoire.')
            }
            else if(nom.length <= 3){
                setNomError('Nom trop court')
            }else if(nom.length > 100){
                setNomError('Nom trop long')
            }else{
                setNomError(undefined)
            }
        }
    },[nom])
    

    const handleSubmit = (e) =>{
        e.preventDefault()
        if (nomError !== undefined){

        }else{
            const competence = {
                id : id,
                nom : nom
            }
            if (button === 'Ajouter'){
                axios
                .post(`/competence/`, competence)
                .then((response)=>{
                    alert("votre compétence est ajouté avec succés");
                    window.location.reload();
                }).catch((error)=>{
                    alert('Error creating competence')
                })
            }else{
                axios
                .put(`/competence/`, {data : competence})
                .then((response)=>{
                    alert(response.data.message)
                    window.location.reload();
                }).catch((error)=>{
                    alert('Un erreur est produit pour la modification de la compétence')
                })
            }
            
        }
    }

    const headers = ['nom']
    const [sorting, setSorting] = useState({
        column: null,
        direction: 'asc',
      });
    
      const handleSort = (column) => {
        if (sorting.column === column) {
          setSorting({
            column,
            direction: sorting.direction === 'asc' ? 'desc' : 'asc',
          });
        } else {
          setSorting({
            column,
            direction: 'asc',
          });
        }
      };

      let sortedCompetences;
      if(competences !== undefined){
        sortedCompetences = [...competences]; // Create a copy of users array
        if (sorting.column) {
        sortedCompetences.sort((a, b) => {
            const aValue = a[sorting.column];
            const bValue = b[sorting.column];
            if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
            return 0;
        });
        }
      }
      
      const deleteCompetence =  async (data)=>{
        try{
            const response = await axios.delete('/competence/', { data: data })
            alert(response.data.message)
            window.location.reload();
        }catch(error){
            console.error('Error deleting user',error)
        }
      }

      const handleClick = (data) =>{
        setId(data.id)
        setNom(data.nom)
        setButton('Modifier')
      }

      const reset = () =>{
        setId(undefined)
        setNom(undefined)
        setButton('Ajouter')
      }

      const [searchTerm, setSearchTerm] = useState('');
      const handleSearchChange = (event) => {
          setSearchTerm(event.target.value);
          const rows = document.getElementsByClassName('selected-row');
          if (rows.length !== 0){
              rows[0].className = ''
          }
      };

      useEffect(()=>{
        if (competences !== undefined){
            sortedCompetences = sortedCompetences.filter((competence) =>
                Object.values(competence).some((field) =>
                    String(field).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
          }
      },[searchTerm])

      
    return(
        <>
            <AdminLayout>
                <Row className='justify-content-md-center mt-4'>
                    <Col md={4}>
                        <center><h3> {button} Competence</h3></center>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup className="mt-4">
                                <Form.Label>Nom de la Competence*</Form.Label>
                                <FormControl type="text"
                                    value={nom} 
                                    onChange={(e) => setNom(e.target.value)} 
                                    isInvalid={!!nomError}
                                    className="mt-1"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{nomError}</Form.Control.Feedback>
                            </FormGroup>

                            <center className="mt-3">
                            <Button className="mt-4" variant="primary" type="submit" style={{width:'150px', borderRadius:'15px' ,marginRight:'20px'}}> {button} </Button>
                            <Button className="mt-4" variant="primary" onClick={reset} style={{width:'150px', borderRadius:'15px'}}> Reset </Button>
                            </center>
                        </Form>
                    </Col>
                    <Col md={8}> 
                    <center><h3> Liste des Competences</h3></center>
                        <center><FormGroup>
                            <FormControl type="text"
                                         placeholder="Search"
                                         className="mt-3"
                                         style={{width: '500px'}}
                                         onChange={handleSearchChange}
                            />
                         </FormGroup></center>

                        <Table className="mt-5" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {headers.map((header, index) => (
                                        <th
                                        key={index}
                                        onClick={() => handleSort(header)}
                                        style={{ cursor: 'pointer' }}
                                        >
                                        {header.charAt(0).toUpperCase() + header.slice(1)}
                                        {sorting.column === header && (
                                            <FontAwesomeIcon
                                            icon={sorting.direction === 'asc' ? faSortUp : faSortDown}
                                            className="ml-1"
                                            />
                                        )}
                                        </th>
                                    ))}
                                    <th>Actions</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {competences && Object.keys(sortedCompetences).length > 0 ? (
                                    Object.values(sortedCompetences)
                                    .filter((competence) =>
                                        Object.values(competence).some((field) =>
                                        String(field)
                                            .toLowerCase()
                                            .includes(searchTerm.toLowerCase())
                                        )
                                    )
                                    .map((rowData, rowIndex) => (
                                        <tr id={"row" + rowIndex} key={rowIndex} onClick={() => handleClick(rowData)}>
                                        <td>{rowIndex + 1}</td>
                                        {Object.entries(rowData).map(([key, cellData], cellIndex) => (
                                            key !== "id" && <td key={cellIndex}>{cellData}</td>
                                        ))}
                                        <td>
                                            <button onClick={() => deleteCompetence(rowData)}>
                                            <center><FontAwesomeIcon icon={faUserMinus} /></center>
                                            </button>
                                        </td>
                                        </tr>
                                    ))
                                ) : (
                                <tr>
                                <td colSpan={headers.length + 1}>No data available</td>
                                </tr>
                            )}
                            </tbody>

                        </Table>
                    </Col>
                    
                </Row>
            </AdminLayout>
        </>
    )
}

export default Competences;