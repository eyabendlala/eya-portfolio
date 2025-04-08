import React, {useState, useEffect} from "react";
import AdminLayout from "../hocs/AdminLayout";
import { Row, Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import './AddUser.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () =>{
    const params = useParams();
    const navigate = useNavigate();
    const [roleStyle, setRoleStyle] = useState(false)
    const required = 'This field is required'
    
    const [role,setRole] = useState('admin');
    const [email,setEmail] = useState('');
    const [emailError, setEmailError] = useState(required)
    const [numero_telephone,setNumero_telephone] = useState('');
    const [numError, setNumError] = useState(required)
    const [adresse,setAdresse] = useState('');
    const [adresseError, setAdresseError] = useState(required)
    const [nationalite,setNationalite] = useState('');
    const [nationaliteError, setNationaliteError] = useState(required)
    const [password,setPassword] = useState('');
    const [confirm, setConfirm] = useState('')
    const [passwordError, setPasswordError] = useState(required)
    const [identifiant, setIdentifiant] = useState('');
    const [identifiantError, setIdentifiantError] = useState(required)

    const [nom,setNom] = useState('');
    const [nomError, setNomError] = useState(required)
    const [prenom,setPrenom] = useState('');
    const [prenomError, setPrenomError] = useState(required)
    const [genre,setGenre] = useState('homme');
    const [genreError, setGenreError] = useState(required)
    const [date_naissance,setDate_naissance] = useState('');
    const [dateError, setDateError] = useState(required)
    const [titre, setTitre] = useState('')
    const [titreError, setTitreError] = useState(null)

    const [description,setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(required)
    const [website,setWebsite] = useState('');
    const [websiteError, setWebsiteError] = useState(required)
    const [secteur,setSecteur] = useState('');
    const [secteurError, setSecteurError] = useState(required)
    const [slogan,setSlogan] = useState(null)
    const [sloganError,setSloganError] = useState('')
    const [twitter, setTwitter] = useState(null)
    const [twitterError, setTwitterError] = useState('')
    const [instagram, setInstagram] = useState(null)
    const [instagramError, setInstagramError] = useState('')
    const [facebook, setFacebook] = useState(null)
    const [facebookError, setFacebookError] = useState('')
    const [linkedin, setLinkedin] = useState(null)
    const [linkedinError, setLinkedinError] = useState('')
    const [pinterest, setPinterest] = useState(null)    
    const [pinterestError, setPinterestError] = useState('')    

    const [societeStyle, setSocieteStyle] = useState('none');
    const [otherStyle, setOtherStyle] = useState('flex')

    const roleChange = (event) =>{
        setRole(event.target.value)
    }

    const genreChange = (event) =>{
        setGenre(event.target.value)
    }

    useEffect(()=>{
        if(role === 'societe'){
            setSocieteStyle('flex')
            setOtherStyle('none')
        }else{
            setSocieteStyle('none')
            setOtherStyle('flex')
        }
    },[role])

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`/admin/users/${params.uid}/`,params.uid);
            let user = response.data;
            setRole(user.role)
            setAdresse(user.adresse)
            setEmail(user.email)
            setNationalite(user.nationalite)
            setNumero_telephone(user.numero_telephone)
            setIdentifiant(user.identifiant)

            if(user.role == 'societe'){
                setWebsite(user.website)
                setDescription(user.description)
                setSecteur(user.secteur)
                setNom(user.nom)
                setSlogan(user.slogan)
                setInstagram(user.instagram)
                setFacebook(user.facebook)
                setTwitter(user.twitter)
                setLinkedin(user.linkedin)
                setPinterest(user.pinterest)
            }else{
                setNom(user.nom)
                setPrenom(user.prenom)
                setDate_naissance(user.date_naissance)
                setGenre(user.genre)
                setTitre(user.titreduprofil)
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };

        if(params.uid !== undefined){
            setRoleStyle(true)
            fetchUser();
        }
      }, [params]);

    useEffect(()=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email.length == 0){
            setEmailError(required)
        }else if(!emailRegex.test(email)){
            setEmailError('Invalid Email')
        }
        else{
            setEmailError(undefined)
        }
    }, [email])

    useEffect(()=>{
        if(password === ''){
            setPasswordError(required)
        }else if (password.length < 8){
            setPasswordError('Password too short!')
        }else{
            setPasswordError(undefined)
        }
    }, [password])

    useEffect(()=>{
        if (password !== confirm){
            setPasswordError('Unmatched password')
        }else{
            setPasswordError(undefined)
        }
    },[confirm])

    useEffect(()=>{
        const phoneRegex = /^\d{8}$/
        if(numero_telephone === ''){
            setNumError(required)
        }else if(!phoneRegex.test(numero_telephone)){ 
            setNumError('Invalid phone number')
        }else{
            setNumError(undefined)
        }
    },[numero_telephone])

    useEffect(()=>{
        if(adresse === ''){
            setAdresseError(required)
        }else if (adresse.length < 6 || adresse.length > 50){
            setAdresseError('Adresse invalid')
        }else{
            setAdresseError(undefined)
        }
    },[adresse])

    useEffect(()=>{
        if (nationalite === ''){
            setNationaliteError(required)
        }else{
            setNationaliteError(undefined)
        }
    },[nationalite])

    useEffect(()=>{
        if (identifiant === ''){
            setIdentifiantError(required)
        }else{
            setIdentifiantError(undefined)
        }
    },[identifiant])

    useEffect(()=>{
        if (nom === ''){
            setNomError(required)
        }else if (nom.length < 3 || nom.length > 15){
            setNomError('Nom invalide')
        }else{
            setNomError(undefined)
        }
    },[nom])

    useEffect(()=>{
        if (prenom === ''){
            setPrenomError(required)
        }else if (prenom.length < 3 || prenom.length > 15){
            setPrenom('Prenom invalide')
        }else{
            setPrenomError(undefined)
        }
        
    },[prenom])
    
    useEffect(()=>{
        if (genre === ''){
            setGenreError(required)
        }else{
            setGenreError(undefined)
        }
    },[genre])

    useEffect(()=>{
        if (date_naissance === ''){
            setDateError(required)
        }else{
            setDateError(undefined)
        }
    },[date_naissance])

    useEffect(()=>{
        if (description === ''){
            setDescriptionError(required)
        }else if (description < 10 || description >= 255){
            setDescriptionError('Description invalide')
        }else{
            setDescriptionError(undefined)
        }
    },[description])

    useEffect(()=>{
        const websiteRegex = /www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/
        if (website === ''){
            setWebsiteError(required)
        }else if(!websiteRegex.test(website)){
            setWebsiteError('Invalid website')
        }else{
            setWebsiteError(undefined)
        }
    },[website])

    useEffect(()=>{
        if (secteur === ''){
            setSecteurError(required)
        }else{
            setSecteurError(undefined)
        }
    },[secteur])

    const handleSubmit = (e) => {
        e.preventDefault();
        if(role === 'societe' && ((emailError !== undefined) || (passwordError !== undefined) || (adresseError !== undefined) 
                                || (numError !== undefined) || (identifiantError !== undefined) || (nationaliteError !== undefined) 
                                || (nomError !== undefined) || (descriptionError !== undefined) || (websiteError !== undefined) 
                                || (secteurError !== undefined))){
                                    toast.error('Vous devez remplir la totalité du formulaire!', {
                                        position: "top-center",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                      }); 
        }else if (role !== 'societe' && ((emailError !== undefined) || (passwordError !== undefined) || (adresseError !== undefined) 
                                || (numError !== undefined) || (identifiantError !== undefined) || (nationaliteError !== undefined) 
                                || (nomError !== undefined) || (prenomError !== undefined) || (genreError !== undefined) 
                                || (dateError !== undefined))){
                                    toast.error('Vous devez remplir la totalité du formulaire!', {
                                        position: "top-center",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                      }); 
        }
        else{
            const user = {
                role: role,
                email: email,
                numero_telephone:numero_telephone,
                identifiant:identifiant,
                adresse: adresse,
                nationalite: nationalite,
                password: password,
                nom:nom,
                prenom: prenom,
                genre:genre,
                date_naissance:date_naissance,
                titreduprofil:titre,
                description:description,
                website:website,
                secteur:secteur,
                slogan:slogan,
                twitter:twitter,
                instagram:instagram,
                facebook:facebook,
                linkedin:linkedin,
                pinterest:pinterest
            };
            if(params.uid === undefined){
                axios
                .post('/admin/users/', user)
                .then((response) => {
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
                    navigate('/admin/users/')
                })
                .catch((error) => {
                    toast.error('Error creating user!', {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }); 
                });
            }else{
                axios
                .put(`/admin/users/${params.uid}/`, user)
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
                    navigate('/admin/users/')
                }).catch((error)=>{
                    toast.error('Error creating user!', {
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
    };

    return(
        <>
            <AdminLayout>
                    <Row className="justify-content-md-center mt-5">
                        <Col md={12}>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mt-4">
                                    <Col md={6} className="offset-md-3">
                                    <Form.Select value={role} className='form-control' onChange={roleChange} disabled={roleStyle}>
                                        <option value="admin">Admin</option>
                                        <option value="candidat">Candidat</option>
                                        <option value="employeur">Employeur Individuel</option>
                                        <option value="societe">Societe</option>
                                    {/* Add more options as needed */}
                                    </Form.Select>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Email</Form.Label>
                                            <FormControl type="text"
                                                defaultValue={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                isInvalid={!!emailError}
                                            />
                                            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Adresse</Form.Label>
                                            <FormControl type="text"
                                                defaultValue={adresse} 
                                                onChange={(e) => setAdresse(e.target.value)}
                                                isInvalid={!!adresseError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{adresseError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Form.Label>Numero de Telephone</Form.Label>
                                            <FormControl type="text"
                                                defaultValue={numero_telephone} 
                                                onChange={(e) => setNumero_telephone(e.target.value)}
                                                maxLength="8" 
                                                style={{width : '400px'}}
                                                isInvalid={!!numError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{numError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Form.Label>Identifiant</Form.Label>
                                            <FormControl type="text"
                                                defaultValue={identifiant} 
                                                onChange={(e)=> setIdentifiant(e.target.value)}
                                                style={{width : '400px'}}
                                                isInvalid={!!identifiantError} 
                                            />
                                            <Form.Control.Feedback type="invalid">{identifiantError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Form.Label>Nationalité</Form.Label>
                                            <FormControl type="text"
                                                defaultValue={nationalite} 
                                                onChange={(e) => setNationalite(e.target.value)}
                                                style={{width : '400px'}}
                                                isInvalid={!!nationaliteError}
                                            />
                                            <Form.Control.Feedback type="invalid">{nationaliteError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Mot de passe</Form.Label>
                                            <FormControl type="password" 
                                                defaultValue={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                isInvalid={!!passwordError}
                                            />
                                            <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Confirmer Mot de passe</Form.Label>
                                            <FormControl type="password" 
                                                         defaultValue={confirm}
                                                         onChange={(e) => setConfirm(e.target.value)}
                                                         isInvalid={!!passwordError}
                                            />
                                            <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                                        </FormGroup>
                                        
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: otherStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Nom</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={nom} 
                                                onChange={(e) => setNom(e.target.value)}
                                                isInvalid={!!nomError}
                                            />
                                            <Form.Control.Feedback type="invalid">{nomError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Prénom</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={prenom} 
                                                onChange={(e) => setPrenom(e.target.value)}
                                                isInvalid={!!prenomError}
                                            />
                                            <Form.Control.Feedback type="invalid">{prenomError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: otherStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Genre</Form.Label>
                                            <Form.Select value={genre} className='form-control' onChange={genreChange}>
                                                <option value="homme">Homme</option>
                                                <option value="femme">Femme</option>
                                                <option value="autre">Autres</option>
                                            </Form.Select>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Date de Naissance</Form.Label>
                                            <FormControl type="date" 
                                                defaultValue={date_naissance} 
                                                onChange={(e) => setDate_naissance(e.target.value)} 
                                                isInvalid={!!dateError}
                                            />
                                            <Form.Control.Feedback type="invalid">{dateError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: otherStyle }}>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Form.Label>Titre du profil</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={titre} 
                                                onChange={(e) => setTitre(e.target.value)} 
                                                isInvalid={!!titreError}
                                            />
                                            <Form.Control.Feedback type="invalid">{titreError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='' style={{ display: societeStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Nom</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={nom} 
                                                onChange={(e) => setNom(e.target.value)}
                                                isInvalid={!!nomError}
                                            />
                                            <Form.Control.Feedback type="invalid">{nomError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Description</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                isInvalid={!!descriptionError}
                                            />
                                            <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: societeStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Website</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={website} 
                                                onChange={(e) => setWebsite(e.target.value)}
                                                isInvalid={!!websiteError}
                                            />
                                            <Form.Control.Feedback type="invalid">{websiteError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Secteur</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={secteur} 
                                                onChange={(e) => setSecteur(e.target.value)}
                                                isInvalid={!!secteurError}
                                            />
                                            <Form.Control.Feedback type="invalid">{secteurError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: societeStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Slogan</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={slogan} 
                                                onChange={(e) => setSlogan(e.target.value)}
                                                isInvalid={!!sloganError}
                                            />
                                            <Form.Control.Feedback type="invalid">{sloganError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Twitter</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={twitter} 
                                                onChange={(e) => setTwitter(e.target.value)}
                                                isInvalid={!!twitterError}
                                            />
                                            <Form.Control.Feedback type="invalid">{twitterError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: societeStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Instagram</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={instagram} 
                                                onChange={(e) => setInstagram(e.target.value)}
                                                isInvalid={!!instagramError}
                                            />
                                            <Form.Control.Feedback type="invalid">{instagramError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Facebook</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={facebook} 
                                                onChange={(e) => setFacebook(e.target.value)}
                                                isInvalid={!!facebookError}
                                            />
                                            <Form.Control.Feedback type="invalid">{facebookError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-4' style={{ display: societeStyle }}>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>LinkedIn</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={linkedin} 
                                                onChange={(e) => setLinkedin(e.target.value)}
                                                isInvalid={!!linkedinError}
                                            />
                                            <Form.Control.Feedback type="invalid">{linkedinError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Form.Label>Pinterest</Form.Label>
                                            <FormControl type="text" 
                                                defaultValue={pinterest} 
                                                onChange={(e) => setPinterest(e.target.value)}
                                                isInvalid={!!pinterestError}
                                            />
                                            <Form.Control.Feedback type="invalid">{pinterestError}</Form.Control.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                
                                <Row className="mt-4">
                                <Col md={12} className="text-center">
                                    <Button className="mt-4" variant="primary" type="submit">Submit</Button>
                                </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
            </AdminLayout>
        </>
    );
}

export default AddUser;