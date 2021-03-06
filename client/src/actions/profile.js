import axios from 'axios';
import { setAlerts } from './alert';
import {GET_PROFILE, PROFILE_ERROR} from './constant';

export const getCurrentProfile = () => async dispatch => {


    try {
        let res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}