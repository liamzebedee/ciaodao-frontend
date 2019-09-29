import { CREATE_GROUP_WEB3_SUCCESS, SPACE_LOAD_SUCCESS, SPACE_LOAD_POSTS_SUCCESS } from "../sagas";

const initialState = {
    data: {
        '0x68cCe7ad9beDf41BEE8A7D1b758EDBb8AEeFb1b9': new Space('0x68cCe7ad9beDf41BEE8A7D1b758EDBb8AEeFb1b9', 'The Lobby', null, 3)
    },
    profiles: {},
    createdSpaces: [
    ],
}

function Space(addr, name, thread, chainId) {
    this.addr = addr
    this.chainId = chainId
    this.posts = []
    this.name = name
    this.thread = thread
}

export default function reduce(state = initialState, action) {
    switch(action.type) {
        case CREATE_GROUP_WEB3_SUCCESS: {
            const { space, name, thread, chainId } = action.payload
            const { createdSpaces, data } = state
            return {
                ...state,
                createdSpaces: createdSpaces.concat([ space ]),
                data: {
                    ...data,
                    [space]: new Space(space, name, thread, chainId)
                }
            }
        }
        case SPACE_LOAD_SUCCESS: {
            const { addr, thread } = action.payload
            const { data } = state
            const space = state.data[addr]

            return {
                ...state,
                data: {
                    ...data,
                    [addr]: {
                        ...space,
                        thread,
                    }
                }
            }
        }
        case SPACE_LOAD_POSTS_SUCCESS: {
            const { addr, posts } = action.payload
            const { data } = state
            const space = state.data[addr]

            return {
                ...state,
                data: {
                    ...data,
                    [addr]: {
                        ...space,
                        posts,
                    }
                }
            }
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