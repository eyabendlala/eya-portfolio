import axios from "axios";
import React,{useState, useEffect} from "react";
import { Navigate, useNavigate } from 'react-router-dom'; 
import { load_user, checkAuthenticated } from "../../actions/auth";
import { connect } from 'react-redux';
import './AddAbon.css';
import Cc from "./Cc";
import Navbar from "../../components/Navbar";
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { Col, Row } from "react-bootstrap";

const AddAbon = (props) => {

    useEffect(() => {
      props.checkAuthenticated();
      props.load_user();
  }, []);
  
    const navigate = useNavigate(); 

    const [typeAbon,setTypeAbon]=useState("classic")
    const [classictype,setClassictype]=useState("basic")
    let user = undefined
    if(props.role === 'societe'){ 
      if(props.societe !== undefined){
        user = props.societe.user
      }
    }else if(props.role === 'employeur'){
      if(props.personne !== undefined){
        user = props.personne.user
      }
    }
    //console.log(user)
    
    if(props.role === "condidat"){
      <Navigate to="/notfoundpage" />
    } else if (props.isAuthenticated === null) {
      // Si isAuthenticated est null, attendez
      return null;
    }
    else if (!props.isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    const Setvalue = (e) => {
        const { name, value } = e.target;
        if (name === 'typeAbon') {
            setTypeAbon(value);
        } else if (name === 'classictype') {
          setClassictype(value);
        }
      };
      const CheckInfo=async()=>{
        let formField =new FormData()
        formField.append('user',JSON.stringify(user))
            try{
              const response=await axios({
                method:'post',
                url:'/Abonnement/CheckA/',
                data :formField,
                });
                const message = response.data.message;
                if (response.status === 200) {
                  // Abonnement exists
                  alert("Vous avez déja un abonnement");
                }}
                 catch(error){
                   if (error.response) {
                     // The request was made and the server responded with a status code
                     console.log(error.response.data); // The response data from the server
                     console.log(error.response.status);} // The status code
                   else if (error.request) {
                     console.log(error.request);}
                   else {
                   console.log('Error', error.message);}}}
                      
  const AddAbonInfo = async () => {
      CheckInfo();
      let formField = new FormData();
      formField.append('user', JSON.stringify(user));
      formField.append('typeAbon', typeAbon);
      formField.append('Classictype', classictype); // Keep this for compatibility
      try {
        const response = await axios({
          method: 'post',
          url: '/Abonnement/CreateA/',
          data: formField,
        });
      //  console.log(response.data);

        if (response.status === 201) {
          navigate(`/payement/${response.data.id}`);
        }
        }catch (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                console.log(error.response.data); // The response data from the server
                console.log(error.response.status); // The status code
              } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
              } else {
                // Something happened in setting up the request
                console.log('Error', error.message);
              }
            };
      }
            /*history.push('/')*/
        
        if(!props.isAuthenticated){
              return <Navigate to="/login" />;
          }
        if(props.role ==="candidat"){
            return <Navigate to="/notfoundpage" />;
          }
            
        return(
          
          <div className="bb">
          <Navbar></Navbar>
      <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Ajouter votre Abonnement</h1>
              
            </div>
          </div>
        </div>
      </section>
          <Cc load_user={load_user}/>
          <Row className="justify-content-md-center mb-4" style={{marginRight:'0px', marginLeft:'0px'}} >
            <Col md={3} className="offer mt-4">
              <div className="reste">
                <div style={{color:'black', fontWeight:'bold', marginTop:'10px'}}>Forfait Basic</div> 
                <div className="box_2 prix">30<div className="dt">dt</div></div>
                <div className="Annonce">Annonce: 5 fois </div>
                <div className="pub">Ideal pour demarrer votre recherche  </div>
              </div>
            </Col>
            <Col md={3} className="offer mt-4">
              <div className="reste">
                <div style={{color:'black', fontWeight:'bold', marginTop:'10px'}}>Forfait Standard</div>
                <div className="box_2 prix">50<div className="dt">dt</div></div>
                <div className="Annonce">Annonce: 10 fois </div>
                <div className="pub">Ideal pour elargir votre portée</div>
              </div>
            </Col>
            <Col md={3} className="offer mt-4">
              <div className="reste" >
                <div style={{color:'black', fontWeight:'bold', marginTop:'10px'}}>Forfait Premium</div>
                <div className="box_2 prix"> 90<div className="dt">dt</div></div>
                <div className="Annonce">Annonce :20 fois </div>
                <div className="pub">Ideal pour maximiser vos opportunités</div> 
              </div>
            </Col>
            <Col md={3} className="offer mt-4">
              <div className="reste">
                <div style={{color:'black', fontWeight:'bold', marginTop:'10px'}}>IAPremium</div>
                <div className="Annonce">Stay Tuned... </div>
              </div>
            </Col>
          </Row>
          <section className="">
        <div className="mt-4">
            <div className='cont_2'>
            <span className="textAdd">Add Abonnement</span>
                <div>
<div>
  <label className="texttitre"><span className="span" >Type your type</span> </label>
        </div>
          </div>
          <div>
            <div>
                              <select id="typeAbon" className=" input " name="typeAbon"  value={typeAbon} onChange={e => Setvalue(e)} required>
                                <option value="classic">classic</option>
                                <option value="iapremium">iapremium</option>
                              </select>
            </div>
          </div>  
          <div>
                    <div>
                        <label className="texttitre" ><span className="span">Type the mode </span></label>
                    </div> 
          </div>
                <div>
                        <select id="Classictype" className="input" name="classictype" value={classictype} onChange={e => Setvalue(e)} required>
            {typeAbon === 'classic' && (
              <>
                <option value="basic">basic</option>
                <option value="standard">standard</option>
                <option value="premium">premium</option>
              </>
            )}
            {typeAbon === 'iapremium' && (
              <option value="iapremium">iapremium</option>
            )}
          </select>
                </div>
                
        
              <button className="btn btn-success " onClick={AddAbonInfo}><span className="span">ADD Abonnnement</span></button>

		                    
                </div>
                </div>
                </section>
            </div>
           
    );}

    const mapStateToProps = (state) => ({
      isAuthenticated: state.auth.isAuthenticated,
      societe: state.auth.user && state.auth.user.societe,
      personne: state.auth.user && state.auth.user.personne,
      role: state.auth.user && state.auth.user.role,
  });
  
export default connect(mapStateToProps, { checkAuthenticated, load_user })(AddAbon);
                
             
  