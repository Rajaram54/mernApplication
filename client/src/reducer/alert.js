import {SET_ALERTS, REMOVE_ALERTS} from '../actions/constant';
const initialState = [];


export default function(state = initialState, action){

    switch (action.type) {
        case SET_ALERTS:
            return [...state, action.payload];
        case REMOVE_ALERTS:
            return state.filter((value) => (value.id !== action.payload));
        default:
            return state;
    }
}