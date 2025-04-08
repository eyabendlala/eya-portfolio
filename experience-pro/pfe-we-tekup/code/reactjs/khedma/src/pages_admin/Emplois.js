import AdminLayout from "../hocs/AdminLayout";
import {React, useState, useEffect} from "react";
import axios from "axios";
import { Col, Row, Table, Form, FormGroup, FormControl, Button, Pagination, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive , faEdit, faSortUp, faSortDown, faMars, faVenus, faVenusMars, faCheck, faFileArchive, faTimes, faShare, faArrowLeft, faArrowRight, faCertificate} from '@fortawesome/free-solid-svg-icons';
import './Emplois.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import addNotification from 'react-push-notification';
import notificationLogo from './images/notificationLogo.png';
import CustomNotification from './CustomNotification'; // Import your custom notification component




const options = [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Zaghouan',
    'Bizerte',
    'Béja',
    'Jendouba', 
    'Kef',
    'Siliana',
    'Kairouan',
    'Sousse',
    'Monastir',
    'Mahdia',
    'Sfax',
    'Kasserine',
    'Sidi Bouzid',
    'Gabès',
    'Medenine',
    'Tataouine',
    'Gafsa',
    'Tozeur',
    'Kebili'
];

const Emplois = (props) => {
    const [emplois, setEmplois] = useState()
    const [archive, setArchive] = useState(0)
    const [expire, setExpire] = useState(0) 
    const [active, setActive] = useState(0)
    const [sortedEmplois, setSortedEmplois] = useState();
    const [categories, setCategories] = useState()

    const [categoryFilter, setCategoryFilter] = useState('all')
    const [regionFilter, setRegionFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    
    const today = new Date().toISOString().split('T')[0];
    const [datePost, setDatePost] = useState('all')
    const [dateExp, setDateExp] = useState('all')

    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10); 

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchEmplois = async () => {
            try {
                const response = await axios.get('/get-emplois');
                const categoryResponse = await axios.get('/get-categories');
                const usersResponse = await axios.get('/admin/users/');
                const abonnementResponse = await axios.get('/Abonnement/List/')
              //  console.log(abonnementResponse.data.abonnements)
                for (const emp of response.data) {
                    const categories = [];
                    if (emp.categories.length !== 0) {
                        for (const cat of emp.categories) {
                            const matchingCategory = categoryResponse.data.find(element => element.id === cat);
                            if (matchingCategory) {
                                categories.push(matchingCategory.nom); 
                            }
                            emp.categories = categories
                        }
                    }else{
                        emp.categories = 'Aucune categorie'
                    }

                    let abonnement = abonnementResponse.data.abonnements.find(abonnement => abonnement.user_id === emp.user)
                    //console.log(abonnement)
                    if(abonnement !== undefined){
                        if (abonnement.payed === true && abonnement.tentative > 0){
                            emp.abonnement = true
                        }else{
                            emp.abonnement = false
                        }
                    }else{
                        emp.abonnement = false
                    }

                    let user = usersResponse.data.users.find(user => user.id === emp.user)
                    if(user.role === 'societe'){
                        user = usersResponse.data.societes.find(user => user.user_id === emp.user)
                        emp.user = user.nom
                    }else{
                        user = usersResponse.data.personnes.find(user => user.user_id === emp.user)
                        emp.user = user.nom +' '+ user.prenom
                    }
                }
             //   console.log(response.data)
                setEmplois(response.data);
                setCategories(categoryResponse.data)

            } catch (error) {
                console.error('Error fetching emplois:', error);
            }
            };
        fetchEmplois();
    },[])

    

    useEffect(()=>{
        if (emplois !== undefined){
            let active = 0
            let archive = 0
            let expire =0

            for(const emp of emplois){
                if(!emp.is_active){
                    active++;
                }
                if(emp.is_archived){
                    archive++
                }

                let today = new Date()
                const expirationDate = new Date(emp.date_expiration);
                if(expirationDate < today){
                    expire++;
                }
            }
            setActive(active)
            setArchive(archive)
            setExpire(expire)
            setSortedEmplois(emplois)
            setCurrentPage(1)
        }
    },[emplois])

    const headers = ['Intitulé du poste', 'Description', 'Publié le', 'Expire le', 'Durée', 'Genre', 
    "Intervalle d'age", 'Localisation', 'Salaire', 'Expérience', 'Region', 'Type', 'Employer', 'Catégories']
    const headerData = ['titre','description','date_postulation','date_expiration','duree_offre', 'montant_paiement',
    'experience','localisation','initervalle_age','region','genre_demande','type_emploi','user_id','categories']

    const customMinWidths = {
        Description : '200px',
        Durée: '80px',
        Genre: '20px',
        Localisation: '100px',
        Salaire: '60px',
        Expérience: '60px',
        Region: '30px',
        Type: '80px',
        Employer: '60px',
        Catégories:'150px'
    };

    const customMaxWidths = {
        Description : '300px',
        Durée: '100px',
        Genre: '40px',
        Localisation: '200px',
        Salaire: '100px',
        Expérience: '100px',
        Region: '60px',
        Type: '100px',
        Employer: '100px',
        Catégories: '200px'
    };

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

      if(emplois !== undefined){
        if (sorting.column) {
        sortedEmplois.sort((a, b) => {
            const columnIndex = headers.indexOf(sorting.column);
            const aValue = a[headerData[columnIndex]];
            const bValue = b[headerData[columnIndex]];
            if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
            return 0;
        });
        }
      }

      const handleClick = ()=>{

      }

      const archiveEmplois = async (data) => {
        try{
            axios.defaults.xsrfCookieName = 'csrftoken'
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
            const response = await axios.put(`/archive-emploi/${data.idEmploi}/`)
            toast.success(response.data, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            window.location.reload()
        }catch(error){
            console.log(error)
        }
      }

   
     
      
      const clickToNotify = (titre, imageUrl) => {
        addNotification({
          
          message:'Un nouveau emploi a été publié!',
          title: titre,
          duration: 0, // Set duration to 0 to make the notification persist
          //icon : "notificationLogo",
          theme: 'darkblue',
          native: true,
          onClick: ()=> console.log('notification push'),
        }); 
        console.log("Notification envoyée avec succès");

      };
      
      const publieEmplois = async (data) => {
            try{
                axios.defaults.xsrfCookieName = 'csrftoken'
                axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
                const response = await axios.put(`/publie-emploi/${data.idEmploi}/`)
                toast.success(response.data, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                if(data.is_active === false){
                    clickToNotify(data.titre, data.image_emploi)
                    console.log("Notification envoyée avec succès");

                } else {
                    console.log("L'offre d'emploi est incative. Aucune notification nécessaire.");

                }
                window.location.reload()
            }catch(error){
        console.error("Erreur lors de la publication de l'emploi :", error);
            }
      }

      const updateEmplois = (data) => {
        navigate('/admin/updateEmplois/'+data.idEmploi);
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
        if (emplois !== undefined){
            if(searchTerm.length !== 0){
                    setSortedEmplois(emplois.filter((emploi) =>
                        Object.values(emploi).some((field) =>
                            String(field).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    )
                )
                setCurrentPage(1)
            }else{
                setSortedEmplois(emplois)
                setCurrentPage(1)
            }
          }
      },[searchTerm])

      const genreStyle = (data) =>{
        if (data === 'Homme')
            return <FontAwesomeIcon icon={faMars} style={{color: "#24f0ff", fontSize: '27px'}} />;
        else if (data === 'Femme')
            return <FontAwesomeIcon icon={faVenus} style={{color: "#f86ded", fontSize: '27px'}} />;
        else 
            return <FontAwesomeIcon icon={faVenusMars} style={{fontSize: '27px'}} />;
      } 

      const categoriesStyle = (data) => {
        let style = ''
        if (data !== 'Aucune categorie'){
            for (let index in data){
                if (index == (data.length - 1)){
                    style = style + data[index]
                }else{
                    style = style + data[index] + ', '
                }
            }
        }else{
            style = data
        }
        return style
      }

      const handleLinkClick = (action) => {
            if (action === 'all'){
                setSortedEmplois(emplois)
                setCurrentPage(1)
            }else if (action === 'publie'){
                setSortedEmplois(emplois.filter((emploi)=>{
                    if (emploi.is_active === true)
                        return emploi 
                }))
                setCurrentPage(1)
            }else if (action === 'attente'){
                setSortedEmplois(emplois.filter((emploi)=>{
                    if (emploi.is_active === false)
                        return emploi
                }))
                setCurrentPage(1)
            }else if (action === 'archive'){
                setSortedEmplois(emplois.filter((emploi)=>{
                    if (emploi.is_archived === true)
                        return emploi
                }))
                setCurrentPage(1)
            }else if (action === 'expire'){
                setSortedEmplois(emplois.filter((emploi)=>{
                    let today = new Date()
                    const expirationDate = new Date(emploi.date_expiration);
                    if(expirationDate < today){
                        return emploi
                    }
                }))
                setCurrentPage(1)
            }
      }

    useEffect(()=>{
    },[sortedEmplois])

    useEffect(()=>{
    if(emplois !== undefined){
        const filteredEmplois = emplois.filter((emploi) => {
            return [
              categoryFilter === 'all' || emploi.categories.includes(categoryFilter),
              regionFilter === 'all' || emploi.region === regionFilter,
              typeFilter === 'all' || emploi.type_emploi === typeFilter,
              datePost === 'all' || emploi.date_postulation <= datePost,
              dateExp === 'all' || emploi.date_expiration <= dateExp,
            ].every(Boolean); 
          });
          setSortedEmplois(filteredEmplois);
          setCurrentPage(1)
    }
        
    },[categoryFilter, regionFilter, typeFilter, datePost, dateExp])

    const resetFilters = ()=>{ 
        setCategoryFilter('all')
        setTypeFilter('all')
        setRegionFilter('all')
        setDatePost('all')
        setDateExp('all')
    }

    let currentJobs = undefined;

    if(sortedEmplois !== undefined){
        currentJobs = sortedEmplois.slice(indexOfFirstJob, indexOfLastJob);
    }

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const changeDateFormat = (date) =>{
        const originalDate = new Date(date);

        const formattedDate = `${originalDate.getDate().toString().padStart(2, '0')}/${(originalDate.getMonth() + 1).toString().padStart(2, '0')}/${originalDate.getFullYear()}`;
        return formattedDate
    }

  
    return(
        <>
            <AdminLayout>
                <Row>
                    <Col md={12}>
                        <center><FormGroup>
                            <FormControl type="text"
                                         placeholder="Search"
                                         className="mt-3"
                                         onChange={handleSearchChange}
                            />
                        </FormGroup></center>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md={12}>
                        <span style={{display:'flex', alignItems:'center'}}>
                            <button className="link-style" onClick={() => handleLinkClick('all')}> Tous ({emplois && emplois.length})</button> | 
                            <button className="link-style" onClick={() => handleLinkClick('publie')}> Publié ({emplois && (emplois.length - active)})</button> | 
                            <button className="link-style" onClick={() => handleLinkClick('attente')}> En attente de relecture ({active})</button> | 
                            <button className="link-style" onClick={() => handleLinkClick('archive')}> Corbeille ({archive})</button> | 
                            <button className="link-style" onClick={() => handleLinkClick('expire')}> Expire aujourd'hui ({expire})</button> 
                        </span>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={2} style={{display:'flex'}}>
                        <FormGroup> 
                        <input
                            type="date"
                            title="date postulation"
                            className="form-control mt-1"
                            style={{ display: 'block', width: '100%', height: 'calc(1.5em + 0.75rem + 2px)',padding: '0.375rem 0.75rem', 
                                fontSize: '1rem', fontWeight: '400', lineHeight: '1.5', color: '#495057', backgroundColor: '#fff',
                                backgroundClip: 'padding-box', border: '1px solid #ced4da',borderRadius: '0.25rem',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                            }}
                            value={datePost}
                            onChange={(e) => setDatePost(e.target.value)}
                        />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup> 
                        <input
                            type="date"
                            title="date expiration"
                            className="form-control mt-1"
                            style={{ display: 'block', width: '100%', height: 'calc(1.5em + 0.75rem + 2px)',padding: '0.375rem 0.75rem', 
                                fontSize: '1rem', fontWeight: '400', lineHeight: '1.5', color: '#495057', backgroundColor: '#fff',
                                backgroundClip: 'padding-box', border: '1px solid #ced4da',borderRadius: '0.25rem',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                            }}
                            value={dateExp}
                            onChange={(e) => setDateExp(e.target.value)}
                        />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup> 
                            <Form.Select
                                className="form-control mt-1"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">Toutes les Catégories</option>
                                { categories && categories.map((category) => (
                                                    <option key={category.nom} value={category.nom}>
                                                        {category.nom}
                                                    </option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup> 
                            <Form.Select
                                className="form-control mt-1"
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                            >
                                <option value='all'>Toutes les Régions</option>
                                { options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup> 
                            <Form.Select
                                className="form-control mt-1"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value='all'>Tous les Types</option>
                                <option value="Court Terme">Court Terme</option>
                                <option value="Moyen Terme">Moyen Terme</option>
                                <option value="Long Terme">Long Terme</option>
                            </Form.Select>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <Button className="mt-1" style={{width:'auto'}} variant="outline-secondary" onClick={resetFilters}> Annuler les filtres</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Table className="mt-4 centered-table" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {headers.map((header, index) => (
                                        <th
                                        key={index}
                                        onClick={() => handleSort(header)}
                                        style={{ cursor: 'pointer' , minWidth: customMinWidths[header] || '130px', maxWidth: customMaxWidths[header] || '150px', textAlign: 'center'}}
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
                                    <th style={{ textAlign: 'center' }}>Statut Abonnement</th>
                                    <th style={{ textAlign: 'center' }}>Publié</th>
                                    <th style={{ textAlign: 'center' }}>Archivé</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                    
                                </tr>
                            </thead>
                            
                            <tbody>
                            { (emplois && currentJobs) && Object.keys(currentJobs).length > 0 ? (
                                Object.values(currentJobs).map((rowData, rowIndex) => (
                                    <tr id={'row'+rowIndex} key={rowIndex} onClick={()=>handleClick(rowData)}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{rowIndex + 1}</td>
                                    {Object.entries(rowData).map(([key, cellData], cellIndex) => (
                                        (key !== 'idEmploi') && (key !== 'image_emploi') && (key !== 'is_archived') && (key !== 'is_active') && (key !== 'abonnement') && 
                                        <td key={cellIndex} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {key === 'genre_demande' ? (
                                                genreStyle(cellData)
                                            ) : key === 'categories' ? (
                                                categoriesStyle(cellData)
                                            ) : key === 'user' ? (
                                                // Custom rendering for specialKey3
                                                <em>{cellData}</em>
                                            ) : key === 'date_postulation' ? (
                                                changeDateFormat(cellData)
                                            ) : key === 'date_expiration' ? (
                                                changeDateFormat(cellData)
                                            ) : (
                                                cellData
                                            )}
                                        </td>
                                    ))}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        { rowData.abonnement === true ? (
                                            <FontAwesomeIcon icon={faCertificate} style={{color:'#3f8222',fontSize: '27px'}} title="Payé" />
                                        ) : (
                                            <Badge bg="danger" style={{color:'white'}}>Non payé</Badge>
                                        )
                                        }         
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    { rowData.is_active === true ? (
                                        <FontAwesomeIcon icon={faCheck} style={{color:'#3f8222',fontSize: '27px'}} title="Publié" />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{color:'#b7271d',fontSize: '27px'}} title="Non publié"  />
                                    )
                                    }
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    { rowData.is_archived === true ? (
                                        <FontAwesomeIcon icon={faFileArchive} style={{color:'black', fontSize: '27px'}} title="Archivé"  />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{color:'#b7271d', fontSize: '27px'}} title="Non archivé"  />
                                    )
                                    }
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', maxWidth:'50px' }}>
                                        <div style={{display:'flex'}}>
                                            <button onClick={() => archiveEmplois(rowData)} title="Archivé">
                                                <FontAwesomeIcon icon={faArchive} />
                                            </button>
                                            <button onClick={() => updateEmplois(rowData)} title="Modifier">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </div>
                                        <button onClick={() => publieEmplois(rowData)} title="Publié">
                                            <FontAwesomeIcon icon={faShare} />
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
                {sortedEmplois && 
                            <Pagination className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ marginRight: 'auto' , width:'40px'}}
                                        variant="outline-info"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Button>
                                    {Array.from({ length: Math.ceil(sortedEmplois.length / jobsPerPage) }, (_, index) => (
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
                                        disabled={currentPage === Math.ceil(sortedEmplois.length / jobsPerPage)}
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

export default Emplois;


