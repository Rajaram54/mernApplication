import { SET_ALERTS, REMOVE_ALERTS } from './constant';

export const setAlerts = (msg, alertType, timeOut = 5000) => dispatch => {
    let id = Math.random();
    dispatch({
        type: SET_ALERTS,
        payload: {
            id,
            msg,
            alertType
        }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERTS, payload: id }), timeOut);
};