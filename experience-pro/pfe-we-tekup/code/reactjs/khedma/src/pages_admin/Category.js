import AdminLayout from "../hocs/AdminLayout";
import {React, useState, useEffect} from "react";
import {Row, Col, Form, FormGroup, FormControl, Button, Table} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Category = () => {
    const [categories, setCategories] = useState();
    const [id, setId] = useState()

    const [nom, setNom] = useState()
    const [nomError, setNomError] = useState('Ce champ est obligatoire.')
    
    const [slug, setSlug] = useState()
    const [slugError, setSlugError] = useState()

    const [parent, setParent] = useState()
    
    const [description, setDescription] = useState()
    const [descriptionError, setDescriptionError] = useState()

    const [button, setButton] = useState('Ajouter')
    

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await axios.get('/get-categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        };
        fetchCategories();
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
    
    useEffect(()=>{
    },[parent])

    const handleSubmit = (e) =>{
        e.preventDefault()
        if (nomError !== undefined){

        }else{
            const category = {
                id : id,
                nom : nom,
                slug: slug,
                description: description,
                parent: parent
            }
            if (button === 'Ajouter'){
                axios
                .post(`/get-categories`, category)
                .then((response)=>{
                    toast.success(response.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }); 
                    window.location.reload();
                }).catch((error)=>{
                    toast.error('Erreur de création de la catégorie!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }); 
                })
            }else{
                axios
                .put(`/get-categories`, {data : category})
                .then((response)=>{
                    toast.success(response.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }); 
                    window.location.reload();
                }).catch((error)=>{
                    toast.success('Erreur de modification de la catégorie', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }); 
                })
            }
            
        }
    }

    const headers = ['nom', 'slug', 'description', 'parent']
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

      let sortedCategories;
      if(categories !== undefined){
        sortedCategories = [...categories]; // Create a copy of users array
        if (sorting.column) {
        sortedCategories.sort((a, b) => {
            const aValue = a[sorting.column];
            const bValue = b[sorting.column];
            if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
            return 0;
        });
        }
      }
      
      const deleteCategory =  async (data)=>{
        try{
            const response = await axios.delete('/get-categories', { data: data })
            toast.success(response.data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }); 
            window.location.reload();
        }catch(error){
            console.error('Error deleting user',error)
        }
      }

      const handleClick = (data) =>{
        setId(data.id)
        setNom(data.nom)
        setSlug(data.slug)
        setParent(data.parent)
        setDescription(data.description)
        setButton('Modifier')
      }

      const reset = () =>{
        setId(undefined)
        setNom(undefined)
        setSlug(undefined)
        setParent('none')
        setDescription(undefined)
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
        if (categories !== undefined){
            sortedCategories = sortedCategories.filter((category) =>
                Object.values(category).some((field) =>
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
                        <center><h3> {button} Categorie</h3></center>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup className="mt-4">
                                <Form.Label>Nom de la Categorie*</Form.Label>
                                <FormControl type="text"
                                    value={nom} 
                                    onChange={(e) => setNom(e.target.value)} 
                                    isInvalid={!!nomError}
                                    className="mt-1"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{nomError}</Form.Control.Feedback>
                            </FormGroup>

                            <FormGroup className="mt-4">
                                <Form.Label>Slug</Form.Label>
                                <FormControl type="text"
                                    value={slug} 
                                    onChange={(e) => setSlug(e.target.value)} 
                                    isInvalid={!!slugError}
                                    className="mt-1"
                                />
                                <Form.Control.Feedback type="invalid">{slugError}</Form.Control.Feedback>
                            </FormGroup>

                            <FormGroup className="mt-4">
                                <Form.Label>Parent</Form.Label>
                                <Form.Select
                                    value={parent}
                                    onChange={(e) => setParent(e.target.value)}
                                    className="form-control mt-1"
                                >
                                    <option value="none">Aucun</option>
                                    { categories && categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nom}
                                        </option>
                                    ))}
                                </Form.Select>
                            </FormGroup>

                            <FormGroup className="mt-4">
                                <Form.Label>Description</Form.Label>
                                <FormControl type="text"
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    isInvalid={!!descriptionError}
                                    className="mt-1"
                                />
                                <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
                            </FormGroup>
                            <center className="mt-3">
                            <Button className="mt-4" variant="primary" type="submit" style={{width:'150px', borderRadius:'15px' ,marginRight:'20px'}}> {button} </Button>
                            <Button className="mt-4" variant="primary" onClick={reset} style={{width:'150px', borderRadius:'15px'}}> Reset </Button>
                            </center>
                        </Form>
                    </Col>
                    <Col md={8}> 
                    <center><h3> Liste des Categories</h3></center>
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
                            {categories && Object.keys(sortedCategories).length > 0 ? (
                                Object.values(sortedCategories).map((rowData, rowIndex) => (
                                    <tr id={'row'+rowIndex} key={rowIndex} onClick={()=>handleClick(rowData)}>
                                    <td>{rowIndex + 1}</td>
                                    {Object.entries(rowData).map(([key, cellData], cellIndex) => (
                                        (key !== 'id') && <td key={cellIndex}>{cellData}</td>
                                    ))}
                                    <td>
                                        <button onClick={() => deleteCategory(rowData)}>
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

export default Category;




