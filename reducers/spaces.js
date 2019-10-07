import Immutable from "seamless-immutable"
import { CREATE_GROUP_WEB3_SUCCESS, SPACE_LOAD_SUCCESS, SPACE_LOAD_POSTS_SUCCESS, SPACE_SET_MEMBERS } from "../sagas";

class Space {
    name = ""
    ethAddress = ""
    chainId = -1
    members = []
    posts = []
    saved = false
}

const theLobby = new Space()
theLobby.name = 'The Lobby'
theLobby.ethAddress = '0x68cCe7ad9beDf41BEE8A7D1b758EDBb8AEeFb1b9'
theLobby.chainId = 3

const initialState = Immutable({
    '0x68cCe7ad9beDf41BEE8A7D1b758EDBb8AEeFb1b9': theLobby
})



export default function reduce(state = initialState, action) {
    switch(action.type) {
        case CREATE_GROUP_WEB3_SUCCESS: {
            const { space, name, chainId } = action.payload
            const ethAddress = space

            const newSpace = new Space
            newSpace.name = name
            newSpace.ethAddress = ethAddress
            newSpace.chainId = chainId
            newSpace.saved = true

            return Immutable.set(
                state, 
                ethAddress, 
                newSpace
            )
        }
        case 'INIT_SPACE': {
            const ethAddress = action.payload.addr
            let space = new Space
            space.ethAddress = ethAddress
            space.name = action.payload.name
            space.chainId = action.payload.chainId
            return Immutable.set(
                state, 
                ethAddress, 
                space
            )
        }
        case 'TOGGLE_SPACE_SAVED': {
            const { ethAddress, saved } = action.payload
            return Immutable.setIn(
                state, 
                [ethAddress, 'saved'], 
                saved
            )
        }
        case SPACE_LOAD_POSTS_SUCCESS: {
            const { addr, posts } = action.payload
            const ethAddress = addr
            return Immutable.setIn(
                state, 
                [ethAddress, 'posts'], 
                posts
            )
        }
        case SPACE_SET_MEMBERS: {
            const { addr, members } = action.payload
            const ethAddress = addr

            return Immutable.setIn(
                state,
                [ethAddress, 'members'],
                members
            )
        }
        default:
            return state
    }
}