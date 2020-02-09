import { useReducer, useCallback } from 'react';
import axios from 'axios';
import { 
    reducer, initialState,
    fetching, success, error
} from '../reducers/loading';
// import { fetching, success, error } from './actionCreators';

const useApiRequest = (endpoint, { verb = 'get', config = {} } = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const makeRequest = useCallback(async () => {
        dispatch(fetching());
        try {
            const response = await axios[verb](endpoint, config);
            console.debug(response)
            dispatch(success(response));
        } catch (e) {
            dispatch(error(e));
        }
    }, [endpoint, verb, config]);

    return [state, makeRequest];
};

export default useApiRequest;