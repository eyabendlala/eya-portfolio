import {React, useEffect, useState} from 'react'
import './UserEmplois.css'
import Slider from '../components/Slider';
import { Row, Col, Form, FormControl, FormGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import backgroundImg from '../cssjs/images/backgroundkhedma.png';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PostEmploi from './PostEmploi';
import CustomTagIcon from './CustomTagIcon'; 


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
// const baseURL = 'http://127.0.0.1:8000';

const UserEmplois = ({isAuthenticated,Role,id,id_empl}) =>{
    const [emplois, setEmplois]=useState([])
    const [emploisToDisplay, setEmploisToDisplay] = useState([])
    const [categories, setCategories] = useState()
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [regionFilter, setRegionFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    
    const today = new Date().toISOString().split('T')[0];
    const [datePost, setDatePost] = useState('all')
    const [dateExp, setDateExp] = useState('all')
    const [filteredEmplois, setFilteredEmplois] = useState([]);
    const [isFavori, setIsFavori] = useState(false); // State to track if the emploi is favorited
    const [isClick, setClick] = useState(false); // State for toggling heart animation

// Fonction pour basculer l'état du clic
const handleHeartClick =  async() => {
    setClick(!isClick); // Inversion de la valeur actuelle de isClick
    await toggleFavoris(id_empl, id);
  };
  
  
          const toggleFavoris = async (id_empl, idUser) => {
            console.log("Toggle favoris called with emploiId:", id_empl, "and userId:", idUser);
          try {
             const response = await axios.post(`/toggle-favoris/`, {
              user_id: idUser,
              emploi_id: id_empl,
          });
          // setIsFavori(!isFavori); // Toggle the state locally
  
            setIsFavori(response.data.isFavori); // Utilise directement la réponse de l'API
            console.log(`L'état de isFavori est mis à jour : ${response.data.isFavori}`); 
  
            // Synchroniser également l'animation avec l'état de favori
            setClick(response.data.isFavori);
          console.log("Response from toggle-favoris API:", response.data);
          // Tu peux ajouter ici la mise à jour de l'état local des emplois favoris si nécessaire
      } catch (error) {
          console.error("Error toggling favoris:", error);
      }
  };
  
  useEffect(() => {
    const checkIfFavori = async () => {
      // Fais la vérification uniquement si tu as les deux identifiants nécessaires
      if (id && id_empl) {
        try {
          // Effectue la requête GET pour vérifier le statut de favori
          const response = await axios.get(`/check-favoris/`, {
            params: { user_id: id, emploi_id: id_empl }
          });
          // Mise à jour de l'état en fonction de la réponse de l'API
          setIsFavori(response.data.isFavori);
          console.log(`L'état de isFavori est mis à jour : ${response.data.isFavori}`); 
  
        } catch (error) {
          console.error("Error checking favoris:", error);
        }
      }
    };
  
    checkIfFavori();
  }, [id, id_empl]); 


    const getEmplois = async () => {
        try {
          const response = await axios.get(`/get-emplois`);
          return response.data;
        } catch (error) {
          console.error("Error fetching emplois:", error);
          return [];
        }
      };
    
      // Apply filtering logic here
      const applyFiltering = (selectedType, selectedRegion) => {
        const filtered = emplois.filter(
          (item) =>
            item.type_emploi === selectedType &&
            item.region === selectedRegion
        );
        setFilteredEmplois(filtered);
      };


    const deleteItem = async (emploiId) => {
        try {
          const response = await axios.delete(`/delete-emploi/${emploiId}/`);
          if (response.status === 204) {
           // console.log("Emploi deleted successfully");
            // Refresh emplois by calling getEmplois again
            const updatedEmplois = await getEmplois();
            setEmplois(updatedEmplois);
            setFilteredEmplois(updatedEmplois); // Refresh filteredEmplois as well
          } else {
            console.error("Error deleting emploi:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting emploi:", error);
        }
      };

    useEffect(()=>{
        const fetchEmplois = async () => {
            try {
                const response = await axios.get('/get-emplois');
                const categoryResponse = await axios.get('/get-categories');
                let emploisActive = []
                for (const emp of response.data) {
                    if(emp.is_active === true){
                        emploisActive.push(emp)
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
                    }
                }
                setEmplois(emploisActive);
                setCategories(categoryResponse.data)

            } catch (error) {
                console.error('Error fetching emplois:', error);
            }
            };
        fetchEmplois();
    },[])

    useEffect(()=>{
        setEmploisToDisplay(emplois)
    },[emplois])

    const resetFilters = ()=>{ 
        setCategoryFilter('all')
        setTypeFilter('all')
        setRegionFilter('all')
        setDatePost('all')
        setDateExp('all')
    }

    useEffect(()=>{
        if(emplois !== undefined){
            const filteredEmplois = emplois.filter((emploi) => {
                return [
                  categoryFilter === 'all' || emploi.categories.includes(categoryFilter),
                  regionFilter === 'all' || emploi.region === regionFilter,
                  typeFilter === 'all' || emploi.type_emploi === typeFilter,
                  datePost === 'all' || emploi.date_postulation === datePost,
                  dateExp === 'all' || emploi.date_expiration <= dateExp,
                ].every(Boolean); 
              });
              setEmploisToDisplay(filteredEmplois);
        }
            
        },[categoryFilter, regionFilter, typeFilter, datePost, dateExp])
    
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
            setEmploisToDisplay(
                emplois.filter((emploi) =>
                    emploi.titre.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }else{
            setEmploisToDisplay(emplois)
        }
        }
    },[searchTerm])
    
    useEffect(()=>{

    },[emploisToDisplay]);


    if(!isAuthenticated){
        return <Navigate to="/login" />;
    }


    return(
        <div className="userEmploi-wrapper">
        
            <Navbar></Navbar>
      <ToastContainer
        // position="top-center"
        // autoClose={2000}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="colored"
      />
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h3 className="text-white font-weight-bold">Cherchez Votre Prochain Emploi! </h3>
              <div className="custom-breadcrumbs">
                <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Offres d'Emploi Disponibles</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="App">
            <div className="app-container">
                
                <div className="post-container">
                
                
                    <div className="container mt-4">
                        <center><h1>Liste des offres d'emplois</h1></center>
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
                        <Row className="mt-3">
                            <Col md={2}>
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
                            <Col md={3}>
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
                            <Col md={3}>
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
    <Button className="mt-4 mb-1" style={{width:'auto'}} variant="outline-secondary" onClick={resetFilters}>Annuler les filtres</Button>
                        </Row>
                        {/* <center>
                            <Button className="mt-4 mb-1" style={{width:'auto'}} variant="outline-secondary" onClick={resetFilters}> Annuler les filtres</Button>
                        </center> */}
                        {emploisToDisplay && emploisToDisplay.length > 0 ? (
                            emploisToDisplay.reduce((rows, emploi, index) => {
                                if (index % 3 === 0) {
                                    rows.push([]);
                                }
                                rows[rows.length - 1].push(emploi);
                                return rows;
                            }, []).map((row, rowIndex) => (
                                <Row key={rowIndex} className='mt-5 mb-5'>
                                    {row.map((emploi, colIndex) => (
                                        <Col key={colIndex} md={4}>
                                            <PostEmploi
                                                image_emploi={emploi.image_emploi}
                                                titre={emploi.titre} 
                                                localisation={emploi.localisation} 
                                                user={emploi.user} 
                                                type_emploi={emploi.type_emploi}
                                                id_empl={emploi.idEmploi}

                                                onclick={() => deleteItem(emploi.idEmploi)}
                                                
                                                description={emploi.description}
                                                date_postulation={emploi.date_postulation}
                                                date_expiration={emploi.date_expiration}
                                                duree_offre={emploi.duree_offre}
                                                genre_demande={emploi.genre_demande}
                                                intervalle_age={emploi.intervalle_age}
                                                montant_paiement={emploi.montant_paiement}
                                                experience={emploi.experience}
                                            />

{Role  === 'candidat' && (
    <div className="icon-container">
      <CustomTagIcon isClicked={isFavori} onClick={handleHeartClick} />
    </div>
  )}
                                        </Col>
                                    ))}
                                </Row>
                            ))
                        ) : (
                            <div className='mt-5 mb-5'>
                                <center> <h4> Il ny'a pas d'Emplois</h4></center>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div> </div>
    )
};

//export default UserEmplois;

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    
    role: state.auth.user && state.auth.user.role,
    id: state.auth.user && state.auth.user.id, 
   
  });
  export default connect(mapStateToProps,) (UserEmplois);