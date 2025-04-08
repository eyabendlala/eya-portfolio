import {React, useEffect, useState} from 'react'
import {Card, Col, Row, Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';
import './HomeBestOff.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faDesktop, faSearch, faShield, faUserFriends, faWallet, faPlusCircle, faUser, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import SocieteCard from './SocieteCard';

const HomeBestOf = (props) =>{
    useEffect(() => {
        props.checkAuthenticated();
        props.load_user();
    }, []);
    //console.log(props)
    const [societes, setSocietes] = useState()

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users/');
           // console.log(response.data)
            let users = response.data.societes.filter(societe => societe.best === true)
            setSocietes(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };

        fetchUsers();
        
    }, []);

    const navigate = useNavigate(); // Initialize the navigate function

    const entrepriseSignIn = () =>{
        navigate(`/signup`, { state: { props: 'societe' } });
    }

    const condidatSignIn = ()=>{
        navigate(`/signup`, { state: { props: 'candidat' } });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [societesPerPage] = useState(4); 
    const indexOfLastSociete = currentPage * societesPerPage;
    const indexOfFirstSociete = indexOfLastSociete - societesPerPage;

    let currentSocietes = undefined;

    if(societes !== undefined){
        currentSocietes = societes.slice(indexOfFirstSociete, indexOfLastSociete);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return(
        <>
            <Row className='mt-4 justify-content-center' style={{margin:'auto'}}>
                <span style={{color:'black', marginBottom: '10px'}}> <b>Offrant les Meileurs offres d'emplois</b></span>
                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faSearch} />
                        <span className='title'> Recherche d'emplois</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Votre emploi idéal à portée en clic ! Découvrez nos meilleurs offres dés maintenant.</span>
                    </div>
                </Card>

                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faUserFriends} />
                        <span className='title'> Postulez pour un bon emploi</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Postulez pour un emploi de qualité dés maintenant.</span>
                    </div>
                </Card>

                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faShield} />
                        <span className='title'> Sécurité de l'emploi</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Offrez-vous une sécurité d'emploi garantie avec nos services de qualité supérieure.</span>
                    </div>
                </Card>

                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faBell} />
                        <span className='title'> Notification d'emploi</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Recevez des notifications pour les nouveaux emplois.</span>
                    </div>
                </Card>

                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faWallet} />
                        <span className='title'> Essayez nos essais de qualité</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Payez pour un essai de qualité.</span>
                    </div>
                </Card>

                <Card className='bestOfBox'>
                    <div className='divTitle'>
                        <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faShield} />
                        <span className='title'> Assistance joyeuse</span><br></br>
                    </div>
                    <div className='divContent'>
                        <span> Profiter d'une assistance joyeuse et efficace pour répondre à tous vos besoins.</span>
                    </div>
                </Card>

                <Card style={{backgroundColor:"#2DAAE1", width:'100%', minHeight:'100px', marginTop:'20px'}}>
                    <Row> 
                    <Col md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', marginTop:'5px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color:'white' }}>5000+</div>
                            <hr></hr>
                            <div style={{ fontSize: '18px', color:'white',marginBottom:'10px' }}>Members</div>
                        </div>
                    </Col>
                        
                    <Col md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', marginTop:'5px'  }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color:'white' }}>15+</div>
                            <hr></hr>
                            <div style={{ fontSize: '18px', color:'white', marginBottom:'10px' }}>Catégories d'emplois</div>
                        </div>
                    </Col>
                    </Row>
                </Card>

                <Card id='bestOfSocietes'>
                    <Row style={{marginTop:'20px'}}>
                    <Row style={{marginTop:'50px'}}>   
                    <span style={{ color: 'white', fontSize: '20px', textAlign: 'center', margin: '0 10px' }}>
  Meilleurs Entreprises<br/> d'embauche
</span>
     </Row>
                        <div style={{position:'absolute', right:40}}>
                            <Button onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    style={{width:'auto', backgroundColor:'transparent'}}
                            >
                                <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faArrowLeft} />
                            </Button>
                            <Button onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentSocietes && currentPage === Math.ceil(societes.length / societesPerPage)}
                                    style={{width:'auto', backgroundColor:'transparent', marginLeft:'10px'}}
                            >
                                <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faArrowRight} />
                            </Button>
                        </div>  
                    </Row>
                    {currentSocietes && currentSocietes.length > 0 ? (
                            currentSocietes.reduce((rows, societe, index) => {
                                if (index % 2 === 0) {
                                    rows.push([]);
                                }
                                rows[rows.length - 1].push(societe);
                               // console.log(rows)
                                return rows;
                            }, []).map((row, rowIndex) => (
                                <Row key={rowIndex} className='mt-5 mb-5'>
                                    {row.length === 2 ? (
                                        row.map((societe, colIndex) => (
                                            colIndex === 0 ?(
                                                <Col key={colIndex} md={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        {societe.prenom !== undefined ? (
                                                            <SocieteCard logo={societe.image} nom={societe.nom + ' ' + societe.prenom}/>
                                                        ) : (
                                                            <SocieteCard logo={societe.logo} nom={societe.nom}/>
                                                        )}
                                                    </div>
                                                </Col>
                                            ) : (
                                                <Col key={colIndex} md={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        {societe.prenom !== undefined ? (
                                                            <SocieteCard logo={societe.image} nom={societe.nom + ' ' + societe.prenom}/>
                                                        ) : (
                                                            <SocieteCard logo={societe.logo} nom={societe.nom}/>
                                                        )}
                                                    </div>
                                                </Col>
                                            )
                                        ))
                                    ) : (
                                        row.map((societe, colIndex) => (
                                            <Col key={colIndex} md={12} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {societe.prenom !== undefined ? (
                                                        <SocieteCard logo={societe.image} nom={societe.nom + ' ' + societe.prenom}/>
                                                    ) : (
                                                        <SocieteCard logo={societe.logo} nom={societe.nom}/>
                                                    )}
                                                </div>
                                            </Col>
                                        ))
                                    )}
                                    
                                </Row>
                            ))
                        ) : (
                            <div className='mt-5 mb-5'>
<span className="badge badge-warning" style={{ width: '512px', marginBottom: '5px', fontSize: '20px', marginTop: '-100px' }}>
  Restez à l'écoute pendant <br /> que nous sélectionnons <br /> soigneusement et chargeons <br /> les meilleures entreprises <br /> pour mettre en avant <br /> leur excellence
</span>
                            </div>
                        )}
                </Card>
                {props.isAuthenticated !== null}{
                    props.isAuthenticated === false ?(
                        <div className='loginContainer' style={{marginTop:'50px'}}>
                            <Card id='loginSociete'>
                                <Row>
                                    <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faDesktop} />
                                </Row>
                                <Row className='mt-2'>
                                    <span style={{color:'black', fontSize:'18px'}}>Je suis un employeur</span>
                                </Row>
                                <hr></hr>
                                <span style={{color:'black'}}> Les entreprises inscrites peuvent publier de nouvelles offres d'emplois, rechercher des candidats...</span>
                                <Row style={{marginBottom:'20px'}}>
                                    <Button onClick={entrepriseSignIn} style={{width:'auto', marginTop:'10px'}}> <FontAwesomeIcon icon={faPlusCircle} size='xs' /> S'inscrire en tant qu'Entreprise</Button>
                                </Row>
                            </Card>

                            <div class="square"><span>OU</span></div>

                            <Card id='loginCondidat'>
                                <Row style={{marginTop:'40px'}}>
                                    <FontAwesomeIcon style={{color:'#2DAAE1', fontSize: '24px'}} icon={faUser} />
                                    <span class="badge badge-warning" style={{position:'absolute', right:40}}>Gratuit</span>
                                </Row>
                                <Row className='mt-2'>
                                    <span style={{color:'white', fontSize:'18px'}}>Je suis un employé</span>
                                </Row>
                                <hr></hr>
                                <span style={{color:'white'}}> Les entreprises connectées peuvent publier de nouvelles offres d'emploi, rechercher des candidats...</span>
                                <Row style={{marginBottom:'20px'}}>
                                    <Button onClick={condidatSignIn} style={{width:'auto', marginTop:'10px'}} variant='danger'> <FontAwesomeIcon icon={faPlusCircle} size='xs' /> S'inscrire en tant que candidat</Button>
                                </Row>
                            </Card>
                        </div>
                    ) : (
                        <div style={{marginTop:'40px', width:'100%'}}>
                            <Card id='loginCondidat'>
                                <Row>
                                <span style={{ color: 'white', fontSize: '15px',textAlign: 'center',marginTop:'40px'}}>
  Merci d'avoir visité le site Khedma.<br/> N'hésitez pas à nous contacter ou à partager<br/> votre expérience avec nous. À la prochaine!
</span>
                                </Row>
                            </Card>
                        </div>
                    )
                }
            </Row>
        </>
    )
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    societe: state.auth.user && state.auth.user.societe,
    personne: state.auth.user && state.auth.user.personne,
    role: state.auth.user && state.auth.user.role,
});

export default connect(mapStateToProps, { checkAuthenticated, load_user })(HomeBestOf);