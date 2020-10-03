
import {
   PROFILE_ERROR,
   GET_PROFILE,
   CLEAR_PROFILE
} from '../actions/constant';

const initalState = {
    profile: null,
    profiles: [],
    loading: true,
    repos: [],
    error: {}
};

export default (state = initalState, action) => {
    const { payload, type } = action;
    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                errror: payload,
                loading: false
            }

        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }

        default: return state;
    }
};

