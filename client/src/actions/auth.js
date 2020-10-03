import axios from 'axios';
import { setAlerts } from './alert';
import setToken  from '../Utils/setUserToken';


import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    USER_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './constant';

export const setUser = () => async dispatch => {
    if(localStorage.token){
        setToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: USER_ERROR
        })
    }
   

}

export const register = ({ name, password, email }) => async dispatch => {
    const config = {
        'Content-Type': 'application/json',
        method: 'POST'
    }

    const body = { name, password, email };

    try {
        let res = await axios.post('/api/user', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(setUser())
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(element => (dispatch(setAlerts(element.msg, 'danger'))));
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

export const login = ( email, password ) => async dispatch => {
    const config = {
        'Content-Type': 'application/json',
        method: 'POST'
    }

    const body = { password, email };

    try {
        let res = await axios.post('/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(setUser())
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(element => (dispatch(setAlerts(element.msg, 'danger'))));
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }
}


export const logout = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    });
    dispatch({
        type: LOGOUT
    });
    
}