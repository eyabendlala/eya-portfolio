import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router';
import './Message.css' 
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Message = ({message}) => {
  const abonnementId = useParams()
  const [res, setRes] = useState(undefined)
  useEffect(()=>{

    const payementSuccess = async (id) =>{
      try {
          axios.defaults.xsrfCookieName = 'csrftoken'
          axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
          const response = await axios.put(`/Abonnement/payementSuccess/${id}`)
          setRes(response.data.message)
      }catch(error){
        console.log(error)
      }
    } 

    payementSuccess(abonnementId.id)
  },[])

  const handleQuit = () =>{
      window.location.href = '/'
  }
  
  return (
    <div className="message-container">
      <p className="message-text">{res && res}</p>
      <button onClick={handleQuit} className='accueil'>  
        <FontAwesomeIcon icon={faRightFromBracket} style={{marginRight:'10px', fontSize:'16px'}}/>
        Retour vers la page d'accueil
      </button>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired, 
};

export default Message;
