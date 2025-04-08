import {React, useState, useEffect} from 'react';
import axios from 'axios';
import AdminLayout from '../hocs/AdminLayout';
import { Row, Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import './AddEmplois.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import NumberInputWithChoice from './NumberInputWithChoice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { load_user } from '../actions/auth';
import { connect } from 'react-redux';

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

const AddEmplois = (props) =>{
    const params = useParams();
    const [nomPage, setNomPage] = useState('Ajouter')
    const navigate = useNavigate();
        
    const [titre , setTitre] = useState('')
    const [type , setType] = useState('Court Terme')
    const [datePostulation, setDatePostulation] = useState()
    const [dateExp , setDateExp] = useState()
    const [duree, setDuree] = useState({'value':0, 'option': 'mois'})
    const [genre , setGenre] = useState('Sans importance')
    const [min , setMin] = useState(18)
    const [max , setMax] = useState(65)
    const [localisation , setLocalisation] = useState('')
    const [montant, setMontant] = useState({'value':0, 'option': '/heure'})
    const [experiance, setExperiance] = useState({'value':0, 'option': 'Debutant'})
    const [region , setRegion] = useState('Tunis')
    const [description , setDescription] = useState('')
    const [image , setImage] = useState()
    const [categories , setCategories] = useState([])
    const [user, setUser] = useState()

    const [titreError , setTitreError] = useState("Le titre de l'offre est obligatoire")
    const [descriptionError , setDescriptionError] = useState("Décrivez votre offre, cela sera plus bénéfique pour les clients :)")
    const [dateExpError , setDateExpError] = useState("La date d'expiration doit être une date valide")
    const [localisationError , setLocalisationError] = useState("Vous devez préciser la localisation")
    
    const [dbCategories , setDBCategories] = useState()
    const [users, setUsers] = useState()

    useEffect(() => {
        props.load_user();
    }, []);

    const connectedUser = props.personne

    useEffect(() => {
        const fetchEmploi = async () => {
          try {
            const response = await axios.get(`/get-emploi/${params.eid}/`);
            const emploi = response.data
            setTitre(emploi.titre)
            setDescription(emploi.description)
            setDateExp(emploi.date_expiration)
            setLocalisation(emploi.localisation)
            setRegion(emploi.region)
            setMin()
            setMax()
            setGenre(emploi.genre_demande)
            setImage(emploi.image_emploi)
            setUser(emploi.user)
            setCategories(emploi.categories)
            setType(emploi.type_emploi)
            
            let numericPart = emploi.duree_offre.match(/\d+/); 
            let textPart = emploi.duree_offre.replace(/\d+/, '').trim();
            setDuree({'value': parseInt(numericPart[0]), 'option': textPart})
            
            numericPart = emploi.montant_paiement.match(/\d+/); 
            textPart = emploi.montant_paiement.replace(/\d+/, '').trim();
            setMontant({'value':parseInt(numericPart[0]), 'option': textPart})

            numericPart = emploi.experience.match(/\d+/); 
            textPart = emploi.experience.replace(/\d+/, '').trim();
            setExperiance({'value':parseInt(numericPart[0]), 'option': textPart})

            const [minAge, maxAge] = emploi.intervalle_age.split(' - ');
            setMin(minAge)
            setMax(maxAge)
          } catch (error) {
            console.error('Error fetching emploi:', error);
          }
        };

        if(params.eid !== undefined){
            setNomPage('Modifier')
            fetchEmploi();
        }
      }, [params]);

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/get-categories');
                setDBCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
            };
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/admin/users/');
                let employeurs = response.data.societes
                for (let user of response.data.users){
                    if(user.id !== connectedUser.user.id){
                        if(user.role === 'employeur'){
                            employeurs.push(response.data.personnes.find(emp => emp.user_id === user.id))
                        }
                    }
                }
                setUsers(employeurs);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
            };
        if( connectedUser !== null){
            fetchCategories();
            fetchUsers();    
        }
    },[connectedUser])

    const handleCategoriesSelect = (event, categoryId) => {
        const isChecked = event.target.checked;
      
        if (isChecked) {
          setCategories([...categories, categoryId]);
        } else {
          setCategories(categories.filter((id) => id !== categoryId));
        }
    };

    useEffect(()=>{
        const currentDate = new Date().toISOString().split('T')[0];;
        setDatePostulation(currentDate);

    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        let exp = ''
        if (experiance.option === 'Debutant'){
            exp = experiance.option
        }else{
            exp = experiance.value+' '+experiance.option
        }
       // console.log(image)
        
        let emplois = {
            'titre': titre,
            'description': description,
            'date_postulation': datePostulation,
            'date_expiration': dateExp,
            'duree_offre': duree.value+' '+duree.option,
            'montant_paiement': montant.value+'DT'+montant.option,
            'experience': exp,
            'localisation' : localisation,
            'intervalle_age' : min +' - '+max,
            'region': region,
            'genre_demande': genre,
            'type_emploi': type,
            'image_emploi': image,
            'user_id': user,
            'categories': categories
        }
        try{
            axios.defaults.xsrfCookieName = 'csrftoken'
            axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
            if(params.eid !== undefined){
                const response = await axios.put(`/put-emploi/${params.eid}/`, emplois);
                toast.success('Emplois modifié avec succés!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });  
                  navigate('/admin/emplois/');
            }else{
                const response = await axios.post("/post-emploi", emplois);
                toast.success('Emplois publié avec succés!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  }); 
                  navigate('/admin/emplois/');
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{ 
        if(titre.length === 0){
            setTitreError("Le titre de l'offre est obligatoire")
        }else if(titre.length >= 100){
            setTitreError('Nom trop long!')
        }else if(titre.length<= 5 && titre.length >0){
            setTitreError('Nom trop court!')
        }else{
            setTitreError(undefined)
        }
    },[titre])

    useEffect(()=>{
        if(description.length === 0){
            setDescriptionError("Décrivez votre offre, cela sera plus bénéfique pour les clients :)")
        }else if(description.length >= 200){
            setDescriptionError('Desrcription trop longe!')
        }else if(description.length<= 20 && description.length >0){
            setDescriptionError('Description trop courte!')
        }else{
            setDescriptionError(undefined)
        }
    },[description])

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    useEffect(()=>{
        if(dateExp < getCurrentDate()){
            setDateExpError('Date non valide')
        }else if(dateExp === undefined){
            setDateExpError("La date d'expiration doit être une date valide")
        }else{
            setDateExpError(undefined)
        }
    },[dateExp])

    useEffect(()=>{
        if(localisation.length === 0){
            setLocalisationError("Vous devez préciser la localisation")
        }else if(localisation.length >= 100){
            setLocalisationError('Localisation trop longe!')
        }else if(localisation.length<= 10 && titre.length >0){
            setLocalisationError('Localisation trop courte!')
        }else{
            setLocalisationError(undefined)
        }
    },[localisation])

    return (
        <>
            <AdminLayout>
                <Row className="justify-content-md-center mt-5">
                    <Col md={12}>
                        <center><h3> {nomPage} une offre d'emplois </h3></center>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Titre de l'offre</Form.Label>
                                        <FormControl type="text"
                                            defaultValue={titre} 
                                            onChange={(e) => setTitre(e.target.value)} 
                                            className='mt-1'
                                            required
                                            isInvalid={!!titreError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{titreError}</Form.Control.Feedback>
                                    </FormGroup>
                                </Col>

                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Description</Form.Label>
                                        <FormControl type="text"
                                            defaultValue={description} 
                                            onChange={(e) => setDescription(e.target.value)} 
                                            className='mt-1'
                                            required
                                            isInvalid={!!descriptionError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Date d'expiration</Form.Label>
                                        <FormControl type="date"
                                            defaultValue={dateExp} 
                                            onChange={(e) => setDateExp(e.target.value)} 
                                            className='mt-1'
                                            required
                                            isInvalid={!!dateExpError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{dateExpError}</Form.Control.Feedback>
                                    </FormGroup>
                                </Col>
                                
                                <Col md={6}>
                                <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Localisation</Form.Label>
                                        <FormControl type="text"
                                            defaultValue={localisation} 
                                            onChange={(e) => setLocalisation(e.target.value)} 
                                            className='mt-1'
                                            required
                                            isInvalid={!!localisationError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{localisationError}</Form.Control.Feedback>
                                    </FormGroup>
                                    
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6} className='mt-3'>
                                    <NumberInputWithChoice 
                                        label={"Durée de l'offre"}
                                        options = {['mois', 'ans']}
                                        min = {0}
                                        max = {30}
                                        values = {duree}
                                        onValueChange= {setDuree}
                                        />
                                </Col>
                                    <Col md={6} className='mt-3'>
                                        <FormGroup>
                                            <Form.Label style={{marginLeft: '20px'}}>Region</Form.Label>
                                            <Form.Select
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="form-control mt-1"
                                            >
                                                { options.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>
                                    </Col>
                            </Row>

                            <Row>
                                <Col md={6} className='mt-3'>
                                    <NumberInputWithChoice
                                        label={'Montant de paiement'}
                                        options = {['/heure', '/mois']}
                                        min = {0}
                                        values = {montant}
                                        onValueChange= {setMontant}
                                        />
                                </Col>
                                
                                <Col md={6} className='mt-3'>
                                    <FormGroup>
                                        <Form.Label style={{marginLeft: '20px'}}>Intervalle d'age</Form.Label>
                                            <div style={{display:'flex'}}>
                                                <FormControl type="range"
                                                    style={{width:'250px', marginRight:'30px', marginLeft:'40px'}}
                                                    min={18}
                                                    max={65}
                                                    value={min} 
                                                    onChange={(e) => setMin(e.target.value)} 
                                                    className='mt-1'
                                                />
                                                <FormControl type="range"
                                                    style={{width:'250px'}}
                                                    min={min}
                                                    max={65}
                                                    value={max} 
                                                    onChange={(e) => setMax(e.target.value)} 
                                                    className='mt-1'
                                                />
                                            </div>
                                        </FormGroup>
                                        <center><p> {min} - {max} </p></center>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <NumberInputWithChoice 
                                        label={'Expérience'}
                                        options = {['Debutant', 'ans']}
                                        min = {0}
                                        max = {10}
                                        values = {experiance}
                                        onValueChange= {setExperiance}
                                        />
                                </Col>
                                
                                <Col md={6}>
                                     <FormGroup> 
                                        <Form.Label style={{marginLeft: '20px'}}>Genre demandé</Form.Label>
                                        <Form.Select
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            className="form-control mt-1"
                                        >
                                            <option value="Sans importance">Sans importance</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </Form.Select>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Type de l'emplois</Form.Label>
                                        <Form.Select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="form-control mt-1"
                                        >
                                            <option value="Court Terme">Court Terme</option>
                                            <option value="Moyen Terme">Moyen Terme</option>
                                            <option value="Long Terme">Long Terme</option>
                                        </Form.Select>
                                    </FormGroup>
                                </Col>
                                
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Image de l'emploi</Form.Label>
                                        <FormControl type="file"
                                            accept="image/*"
                                            defaultValue={image} 
                                            onChange={(e) => setImage(e.target.value)} 
                                            className='mt-1'
                                        />
                                        {image && (
                                            <img src={image} alt="Selected" className="mt-1" style={{ maxWidth: '100px' }} />
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Employeur</Form.Label>
                                        <Form.Select
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)}
                                            className="form-control mt-1"
                                        >
                                            {connectedUser && (
                                                <option key={connectedUser.user.id} value={connectedUser.user.id}>{ connectedUser.personne.nom + ' ' +connectedUser.personne.prenom }
                                                </option>
                                            )}
                                            { users && users.map((user) => (
                                                <option key={user.user_id} value={user.user_id}>
                                                    {user.prenom ? user.nom + ' ' + user.prenom : user.nom}
                                                </option>
                                            ))}
                                    
                                        </Form.Select>
                                    </FormGroup>
                                </Col>
                                
                                <Col md={6}>
                                    <FormGroup className='mt-3'>
                                        <Form.Label style={{marginLeft: '20px'}}>Catégories de l'offre</Form.Label>
                                        
                                        <div style={{display:'flex'}}>
                                            {dbCategories && dbCategories.map((categorie) => (
                                                <div className='category-box' key={categorie.id}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value={categorie.id}
                                                            checked={categories.includes(categorie.id)}
                                                            onChange={(e) => handleCategoriesSelect(e, categorie.id)}
                                                            style={{width:'25px'}}
                                                        />
                                                            <span>{categorie.nom}
                                                                {categories.includes(categorie.id) && (
                                                                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                                                                )}
                                                            </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col md={12} className="text-center">
                                    <Button className="mt-4" variant="primary" type="submit" style={{borderRadius :'15px'}}>Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </AdminLayout>
        </>
    )
}


const mapStateToProps = (state) => {
    // Vérification des données d'état Redux
    console.log("State auth:", state.auth);
  
    // Vérification si l'utilisateur est authentifié
    console.log("Is authenticated:", state.auth.isAuthenticated);
  
    return {
    isAuthenticated: state.auth.isAuthenticated,
    societe: state.auth.user && state.auth.user.societe,
    personne: state.auth.user && state.auth.user.personne,
    role: state.auth.user && state.auth.user.role,
    };
  };

export default connect(mapStateToProps, { load_user })(AddEmplois);