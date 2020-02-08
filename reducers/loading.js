// https://medium.com/@audisho.sada/using-react-hooks-to-asynchronously-make-api-requests-1fdf52f797ce

const prefix = 'useApiRequest/';

// import { FETCHING, SUCCESS, ERROR } from './actionTypes';
export const FETCHING = `${prefix}FETCHING`;
export const SUCCESS = `${prefix}SUCCESS`;
export const ERROR = `${prefix}ERROR`;


export const initialState = {
    status: null,
    response: null,
};

export const reducer = (state = initialState, { type, response } = {}) => {
    switch (type) {
        case FETCHING:
            return { ...initialState, status: FETCHING };
        case SUCCESS:
            return { ...state, status: SUCCESS, response };
        case ERROR:
            return { ...state, status: ERROR, response };
        default:
            return state;
    }
};


export const fetching = () => ({ type: FETCHING });
export const success = response => ({ type: SUCCESS, response });
export const error = response => ({ type: ERROR, response });