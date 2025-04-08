import {React, useState, useEffect} from 'react'
import axios from 'axios'
import AdminLayout from "../hocs/AdminLayout"
import './Abonnements.css'
import { Row, Col, Table, Form, FormGroup, FormControl, Button, Pagination, Badge} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSortUp, faSortDown, faArrowLeft, faArrowRight, faCertificate } from '@fortawesome/free-solid-svg-icons';

const Abonnements = () => {
    const [abonnements, setAbonnements] = useState()
    const [filteredAbonnements, setFilteredAbonnements] = useState()
    const [currentPage, setCurrentPage] = useState(1);

    const headers = ['type','Date Paiement','Utilisateur','Categorie', 'prix','tentatives', 'payement']

    const [typeFilter, setTypeFilter] = useState('all')
    const [categorieFilter, setCategorieFilter] = useState('all')
        
    const [display, setDisplay] = useState('none')
    useEffect(()=>{
        const fetchAbonnements = async () => {
            try {
                const response = await axios.get('/Abonnement/List/');
                setAbonnements(response.data.abonnements);
                setFilteredAbonnements(response.data.abonnements)
            } catch (error) {
                console.error('Error fetching abonnements:', error);
            }
            };
        fetchAbonnements();
    }, [])

    //console.log(abonnements)

    const changeDateFormat = (date) =>{
        const originalDate = new Date(date);

        const formattedDate = `Le ${originalDate.getDate().toString().padStart(2, '0')}/${(originalDate.getMonth() + 1).toString().padStart(2, '0')}/${originalDate.getFullYear()} à ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate
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
        if (abonnements !== undefined){
            if(searchTerm.length !== 0){
                    setFilteredAbonnements(abonnements.filter((abonnement) =>
                        Object.values(abonnement).some((field) =>
                            String(field).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    )
                )
                setCurrentPage(1)
            }else{
                setFilteredAbonnements(abonnements)
            }
          }
      },[searchTerm])

    useEffect(()=>{
        if(abonnements !== undefined){
            if(typeFilter === 'classic'){
                setDisplay('block')
            }else{
                setDisplay('none')
            }
            const filtered = abonnements.filter((abonnement) => {
                return [
                  typeFilter === 'all' || abonnement.typeAbon === typeFilter,
                  categorieFilter === 'all' || abonnement.categorie === categorieFilter
                ].every(Boolean); 
              });
             // console.log(filtered)
              setFilteredAbonnements(filtered)
        }            
        },[typeFilter, categorieFilter])

    const resetFilters = ()=>{ 
        setTypeFilter('all')
        setCategorieFilter('all')
    }

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
      useEffect(()=>{
        if (sorting.column) {
            setFilteredAbonnements(filteredAbonnements.sort((a, b) => {
              const aValue = a[sorting.column];
              const bValue = b[sorting.column];
              if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
              return 0;
            }))
          }
      },[sorting])
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const [abonnementPerPage] = useState(10); 
    const indexOfLastJob = currentPage * abonnementPerPage;
    const indexOfFirstJob = indexOfLastJob - abonnementPerPage;

    let currentAbonnements = undefined;

    if(filteredAbonnements !== undefined){
        currentAbonnements = filteredAbonnements.slice(indexOfFirstJob, indexOfLastJob);
    }

    
    return(
        <>
            <AdminLayout>
                <center><h1>Liste des Abonnements</h1></center>
                <Row className='justify-content-md-center mt-4'>
                    <FormGroup>
                        <FormControl type="text"
                                    placeholder="Search"
                                    style={{ width: "1150px" }}
                                    onChange={handleSearchChange}
                        />
                    </FormGroup>
                </Row>
                <Row className="mt-4">
                    {display === 'none' ?(<Col md={4}></Col>) : (<Col md={3}></Col>)}
                    <Col md={2}>
                        <Form.Select
                            className="form-control mt-1"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Toutes les Types</option>
                            <option value="classic"> Classic </option>
                            <option value="iapremium"> IAPremuim </option>
                        </Form.Select>
                    </Col>
                    <Col md={2} style={{display: display}}>
                        <Form.Select
                            className="form-control mt-1"
                            value={categorieFilter}
                            onChange={(e) => setCategorieFilter(e.target.value)}
                        >
                            <option value="all">Toutes les categories</option>
                            <option value="basic"> Basic </option>
                            <option value="standard"> Standard </option>
                            <option value="premuim"> Premuim </option>
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                        <Button className="mt-1" style={{width:'auto'}} variant="outline-secondary" onClick={resetFilters}> Annuler les filtres</Button>
                    </Col>
                    {display === 'none' ?(<Col md={4}></Col>) : (<Col md={3}></Col>)}
                </Row>
                <Row className='mt-4'>
                    <Col md={12}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {headers.map((header, index) => (
                                        <th key={index}
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
                                </tr>
                            </thead>
                            <tbody>
                            {(filteredAbonnements && currentAbonnements) && Object.keys(currentAbonnements).length > 0 ? (
                                Object.values(currentAbonnements).map((rowData, rowIndex) => (
                                    <tr id={'row'+rowIndex} key={rowIndex}>
                                    <td>{rowIndex + 1}</td>
                                    {Object.entries(rowData).map(([key, cellData], cellIndex) => (
                                        key !== 'id' && key !== 'user_id' && (
                                            <td key={cellIndex}>
                                            {key === 'date_paiement' ? (
                                                changeDateFormat(cellData)
                                            ) : key === 'prix' ? (
                                                cellData + 'DT'
                                            ) : key === 'payed' ? (
                                                cellData === true ? (
                                                    <FontAwesomeIcon icon={faCertificate} style={{color:'#3f8222',fontSize: '27px'}} title="Payé" />
                                                ) : (
                                                    <Badge bg="danger" style={{color:'white'}}>Non payé</Badge>
                                                )
                                            ) : (
                                                cellData
                                            )}
                                            </td>
                                        )
                                        ))}
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
                {(filteredAbonnements) && 
                            <Pagination className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ marginRight: 'auto' , width:'40px'}}
                                        variant="outline-info"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Button>
                                    {Array.from({ length: Math.ceil(filteredAbonnements.length / abonnementPerPage) }, (_, index) => (
                                        <Button
                                            key={index}
                                            active={index + 1 === currentPage }
                                            onClick={() => handlePageChange(index + 1)}
                                            style={{width:'auto', marginRight:'5px'}}
                                            variant="outline-dark"
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredAbonnements.length / abonnementPerPage)}
                                        style={{ marginLeft: 'auto' , width:'40px'}}
                                        variant="outline-info"
                                    >
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Button>
                            </Pagination>
                        }
            </AdminLayout>
        </>
    )
}

export default Abonnements;