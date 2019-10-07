import { LOAD_BOX3, VISIT_SPACES, CREATE_GROUP, LOAD_WEB3, SUBMIT_THING, SPACES_LOAD, SPACE_LOAD, LOAD_POSTS, FETCH_PROFILE, USER_LOGOUT, USER_LOGOUT_BEGIN, LOAD_SPACE } from "../sagas";

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
        type: LOAD_SPACE,
        payload: {
            addr,
        }
    }
}

export function submitThing(spaceAddress, threadKey, text) {
    return {
        type: SUBMIT_THING,
        payload: {
            spaceAddress,
            threadKey,
            text,
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

export function logout() {
    return {
        type: USER_LOGOUT_BEGIN
    }
}

export function toggleSaved(ethAddress, saved) {
    return {
        type: 'TOGGLE_SPACE_SAVED',
        payload: {
            ethAddress,
            saved
        }
    }
}