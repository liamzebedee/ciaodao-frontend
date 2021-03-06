import _, { sortBy, reverse } from 'lodash'

export function isLoggedIn(state) {
    return state.user.loggedInUserId !== null
}

export function getUsersAvailable(state) {
    return Object.values(state.users).map(({ username, id }) => {
        return { username, id }
    }); 
    // TODO
}

export function getUserById(state, id) {
    return state.users[id]
}

export function getUser(state, username) {
    for(let user of Object.values(state.users)) {
        if(user.username == username) return user;
    }
    return null
}

export function loggedInUser(state) {
    let userId = state.user.loggedInUserId
    if(userId == null) {
        return {
            reputation: 1,
            registered: null,
            posts: [],
            votes: [],
            username: "()",
            userId,
        }
    }

    let user = state.users[userId]
    return user
}

export function filterPosts(posts, members) {
    return reverse(
        sortBy(posts, 'timestamp')
    )
}

export function getMembers(posts) {
    const members = _.uniq(posts.map(post => post.author))
    return members
}

export function getProfile(state, did) {
    return _.find(
        state.profiles,
        { did }
    )
}

export function getEthAddress(state, did) {
    return state.profiles.ethAddresses[did]
}

// Maybe we can list spaces of other networks in future
// But we should just name them properly for now
export function selectSpaces(state) {
    // const spaces = _.filter(Object.values(state.spaces.data), { chainId: state.flows.chainId })
    return state.spaces.data
}

export function getMessagesForSpace(state, spaceId) {
    const messages = _.filter(
        state.messages,
        { space: spaceId }
    ) 
    return messages
}