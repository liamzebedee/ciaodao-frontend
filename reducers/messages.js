import { ADD_MESSAGE, MARK_MESSAGE_STATUS, GET_MESSAGES_SUCCESS } from "../sagas"

const initialState = []

export default function reduce(state = initialState, action) {
    switch(action.type) {
        case ADD_MESSAGE:
            return [
                ...state,
                action.payload
            ]
        
        case GET_MESSAGES_SUCCESS:
            return [
                ...state,
                ...action.payload
            ]
        
        case MARK_MESSAGE_STATUS:
            return state.map(message => {
                if(message.messageId == action.payload.messageId) return messageReducer(message, action)
                return message
            })
        
        default:
            return state
    }
}


function messageReducer(state, action) {
    switch(action.type) {
        case MARK_MESSAGE_STATUS:
            return {
                ...state,
                status: action.payload.status
            }
        default:
            return state
    }
}