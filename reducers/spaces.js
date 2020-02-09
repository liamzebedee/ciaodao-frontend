import { CREATE_GROUP_WEB3_SUCCESS, SPACE_LOAD_SUCCESS, SPACE_LOAD_POSTS_SUCCESS } from "../sagas";

const initialState = {
    data: []
}

function Space(addr, name, thread, chainId) {
    this.addr = addr
    this.chainId = chainId
    this.members = []
    this.posts = []
    this.name = name
    this.thread = thread
}

export default function reduce(state = initialState, action) {
    switch(action.type) {
        case CREATE_GROUP_WEB3_SUCCESS: {
            return state
        }
        case 'ADD_USER_PROFILE': {
            const { user, profile } = action.payload
            const { profiles } = state
            return {
                ...state,
                profiles: {
                    ...profiles,
                    [user]: profile
                }
            }
        }
        default:
            return state
    }
}