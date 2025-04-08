//axios :try et catch 
import axios from 'axios';
import{
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SUPPRIMER_COMPETENCE_SUCCESS,
    SUPPRIMER_COMPETENCE_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    MODIFICATION_SUCCESS,
    MODIFICATION_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    RATING_SOCIETE_SUCCESS,
    RATING_SOCIETE_FAIL,
    RATING_CONDIDAT_SUCCESS,
    RATING_CONDIDAT_FAIL,
    AJOUTER_COMPETENCE_SUCCESS,
    AJOUTER_COMPETENCE_FAIL,
    LOGOUT

}from './types';


export const load_user = () => async (dispatch) => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json',
        },
      };
  
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
  
        dispatch({
          type: USER_LOADED_SUCCESS,
          payload: { ...res.data, role: res.data.role, user: res.data  } 
        });
        
  
      // Fetch associated Societe or Personne data based on role
if (res.data.role === 'societe') {
  const userId = res.data.id; 
  const societeRes = await axios.get(`${process.env.REACT_APP_API_URL}/societe/${userId}/`, config);
  dispatch({
    type: USER_LOADED_SUCCESS,
    payload: { ...res.data, societe: societeRes.data },
  });
} else if (res.data.role === 'employeur' || res.data.role === 'candidat') {
  const userId = res.data.id;
  const personneRes = await axios.get(`${process.env.REACT_APP_API_URL}/personne/${userId}/`, config);
  dispatch({
    type: USER_LOADED_SUCCESS,
    payload: { ...res.data, personne: personneRes.data },
  });
} else if (res.data.role === 'admin') {
  const userId = res.data.id;
  const userAccountRes = await axios.get(`${process.env.REACT_APP_API_URL}/useraccount/${userId}/`, config);
  dispatch({
    type: USER_LOADED_SUCCESS,
    payload: { ...res.data, admin: userAccountRes.data },
  });
}
        
      } catch (err) {
        dispatch({
          type: USER_LOADED_FAIL,
        });
      }
    } else {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  };
  
export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config)

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true // Send cookies with the request
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(load_user());
        return true;
        
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
      return false;
    }
};


export const signup = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  

  let url;
  if (formData.get('role') === 'employeur' || formData.get('role') === 'candidat') {
    url = `${process.env.REACT_APP_API_URL}/personne/`;
  } else if (formData.get('role') === 'societe') {
    url = `${process.env.REACT_APP_API_URL}/societe/`;
  }

  try {
    const res = await axios.post(url, formData, config);

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
    return false;
  }
};
export const getPersonneParId = async (id) => {
  id = id || '';
  return await axios.get(`${process.env.REACT_APP_API_URL}/personne/${id}/`);
}
export const getSocieteParId = async (id) => {
  id = id || '';
  return await axios.get(`${process.env.REACT_APP_API_URL}/societe/${id}/`);
}

export const modifierPersonne = (id, personne) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  

  let url=`${process.env.REACT_APP_API_URL}/modifierPersonne/${id}/`;

  try {
    const res = await axios.put(url, personne, config);
    //console.log("personnnne", personne);
    //console.log("idddd",id);
    dispatch({
      type: MODIFICATION_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: MODIFICATION_FAIL,
    });
    return false;
  }
};

export const modifierSociete = (id, societe) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  

  let url=`${process.env.REACT_APP_API_URL}/societe/modifierSociete/${id}/`;

  try {
    const res = await axios.put(url, societe, config);

    dispatch({
      type: MODIFICATION_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: MODIFICATION_FAIL,
    });
    return false;
  }
};
  

export const verify = (uid,token)=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ uid,token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);

        dispatch({
            type: ACTIVATION_SUCCESS
    
        });

    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
    
};
export const reset_password =(email) => async dispatch=>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body=JSON.stringify({ email });
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`,body,config);
        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
        
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
        
    }

};
export const reset_password_confirm =(uid,token,new_password, re_new_password)=> async dispatch=> {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid,token,new_password, re_new_password });
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`,body,config);
        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
        
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
        
    }
};
export const logout= ()=>dispatch =>{
    dispatch({
        type: LOGOUT
    });
    
};
export const getCandidats= async (id) => {
  id = id || '';
  let url=`${process.env.REACT_APP_API_URL}/listcandidats/`;

  return await axios.get(url);
};
export const ratingcandidat = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const url = `${process.env.REACT_APP_API_URL}/donnerratingcandidat/`;

  try {
    const res = await axios.post(url, formData, config);

    dispatch({
      type: RATING_CONDIDAT_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: RATING_CONDIDAT_FAIL,
    });
    return false;
  }
};
export const geCompetencesByPerson= async (id) => {
  let url=`${process.env.REACT_APP_API_URL}/personne/${id}/competences/`;

  return await axios.get(url);
};

export const geAllCompetences= async (dispatch) => {
  let url=`${process.env.REACT_APP_API_URL}/competence/`;
  return await axios.get(url);
};

export const ajoutercompetenceuser = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
  };
  
  const url = `http://localhost:8000/ajoutercompetenceaucandidat/`;

  try {
    const res = await axios.post(url, formData, config);

    dispatch({
      type: AJOUTER_COMPETENCE_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: AJOUTER_COMPETENCE_FAIL,
    });
    return false;
  }
};


export const supprimercompetencecandidat = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
  };
  
  const url = `${process.env.REACT_APP_API_URL}/supprimercompetencecandidat/`;

  try {
    const res = await axios.post(url, formData, config);

    dispatch({
      type: SUPPRIMER_COMPETENCE_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: SUPPRIMER_COMPETENCE_FAIL,
    });
    return false;
  }
};


export const getmoyenneratingparcandidat = async (id) => {
  let url = `${process.env.REACT_APP_API_URL}/get_moyennerating_candidat/${id}/`;
  return await axios.get(url);
};



export const ratingsociete = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const url = `${process.env.REACT_APP_API_URL}/donnerratingausociete/`;

  try {
    const res = await axios.post(url, formData, config);

    dispatch({
      type: RATING_SOCIETE_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: RATING_SOCIETE_FAIL,
    });
    return false;
  }
};

export const getmoyenneratingparsociete = async (id) => {
  let url = `${process.env.REACT_APP_API_URL}/getmoyenneratingsociete/${id}/`;
  return await axios.get(url);
};

export const getSocietes= async (id) => {
  let url=`${process.env.REACT_APP_API_URL}/listsocietes/`;

  return await axios.get(url);
};


export const modifiermotdepasseprofile = (id, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  

  let url=`${process.env.REACT_APP_API_URL}/modifiermotdepasseprofile/${id}/`;

  try {
    const res = await axios.put(url, formData, config);
    //console.log("personnnne", personne);
    //console.log("idddd",id);
    dispatch({
      type: MODIFICATION_SUCCESS,
      payload: res.data,
    });
    return true;
  } catch (err) {
    dispatch({
      type: MODIFICATION_FAIL,
    });
    return false;
  }
};