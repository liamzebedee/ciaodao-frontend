import { LOAD_BOX3, VISIT_SPACES, CREATE_GROUP, LOAD_WEB3, SUBMIT_THING, SPACES_LOAD, SPACE_LOAD, LOAD_POSTS, FETCH_PROFILE, LOGIN_START, LOGOUT, POST_MESSAGE, GET_MESSAGES, SHOW_USER_PROFILE } from "../sagas";

export function loadWeb3() {
    return {
        type: LOAD_WEB3
    }
}

export function loadBox3() {
    return {
        type: LOAD_BOX3
    }
}

export function login() {
    return {
        type: LOGIN_START
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}

export function visitSpaces() {
    return {
        type: VISIT_SPACES
    }
}

export function createSpace(name, membershipType, addressDetails) {
    return {
        type: CREATE_GROUP,
        payload: {
            name, membershipType, addressDetails
        }
    }
}

export function loadSpaces() {
    return {
        type: SPACES_LOAD
    }
}

export function loadSpace(addr) {
    return {
        type: SPACE_LOAD,
        payload: {
            addr,
        }
    }
}

export function submitThing() {
    return {
        type: SUBMIT_THING
    }
}

export function addUserProfile(user, profile) {
    return {
        type: 'ADD_USER_PROFILE',
        payload: {
            user,
            profile
        }
    }
}

export function loadPosts(posts, spaceAddress) {
    return {
        type: LOAD_POSTS,
        payload: {
            posts,
            spaceAddress
        }
    }
}

export function fetchProfile(did) {
    return {
        type: FETCH_PROFILE,
        payload: {
            did
        }
    }
}

export function postMessage(message) {
    return {
        type: POST_MESSAGE,
        payload: {
            message
        }
    }
}

export function getMessages(spaceId) {
    return {
        type: GET_MESSAGES,
        payload: {
            spaceId
        }
    }
}

export function showUserProfile(did) {
    return {
        type: SHOW_USER_PROFILE,
        payload: {
            did
        }
    }
}