import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    MODIFICATION_SUCCESS,
    MODIFICATION_FAIL,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    RATING_CONDIDAT_SUCCESS,
    RATING_CONDIDAT_FAIL,
    AJOUTER_COMPETENCE_SUCCESS,
    RATING_SOCIETE_SUCCESS,
    RATING_SOCIETE_FAIL,
    AJOUTER_COMPETENCE_FAIL,
    SUPPRIMER_COMPETENCE_SUCCESS,
    SUPPRIMER_COMPETENCE_FAIL,
    LOGOUT,
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case SIGNUP_SUCCESS:
            return{
                ...state,
                isAuthenticated:false
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
            }
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case MODIFICATION_SUCCESS:
        case MODIFICATION_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case RATING_CONDIDAT_SUCCESS:
        case RATING_CONDIDAT_FAIL:
        case RATING_SOCIETE_SUCCESS:
        case RATING_SOCIETE_FAIL:
        case ACTIVATION_SUCCESS:
        case AJOUTER_COMPETENCE_SUCCESS:
        case AJOUTER_COMPETENCE_FAIL:
        case SUPPRIMER_COMPETENCE_SUCCESS:
        case SUPPRIMER_COMPETENCE_FAIL:   
        case ACTIVATION_FAIL:

            return{
                ...state
            }
        default:
            return state
    }
};