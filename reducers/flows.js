import { CREATE_GROUP_WEB3_SUCCESS, LOAD_BOX3_COMPLETE, WEB3_LOADED } from "../sagas";

const FLOW_CREATE_GROUP = 'FLOW_CREATE_GROUP'
const WEB3_LOADING = 'WEB3_LOADING'
const BOX3_LOADING = 'BOX3_LOADING'
export const FLOW_LOAD_SPACE = 'FLOW_LOAD_SPACE'

const initialState = {
    [FLOW_CREATE_GROUP]: {
        step: 'start'
    },
    [WEB3_LOADING]: true,
    [BOX3_LOADING]: true,
    [FLOW_LOAD_SPACE]: {
        error: null
    },
    chainId: null
}


export default function(state = initialState, action) {
    switch(action.type) {
        case CREATE_GROUP_WEB3_SUCCESS:
            return {
                ...state,
                [FLOW_CREATE_GROUP]: {
                    ...action.payload,
                    step: 'success',
                }
            }
        case WEB3_LOADED:
            const { payload: { chainId } } = action
            
            return {
                ...state,
                [WEB3_LOADING]: false,
                chainId
            }
        case LOAD_BOX3_COMPLETE:
            return {
                ...state,
                [BOX3_LOADING]: false
            }
        case 'OPEN_SPACE_FAILED':
            return {
                ...state,
                FLOW_LOAD_SPACE: {
                    error: action.payload.reason
                }
            }
        default:
            return state
    }
}