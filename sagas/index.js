import { call, put, takeLatest, select, fork, cancelled, take, takeEvery, takeLeading } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import Box from '3box';
import Router from 'next/router'
import { persistor } from '../pages/_app';

import { ethers, ContractFactory } from 'ethers';
import { MEMBERSHIP_TYPE_TOKEN, MEMBERSHIP_TYPE_INVITE } from '../components/pages/SpacesPage';
import { submitThing } from '../actions';
import { getMembers } from '../selectors';
import axios from 'axios'
import { API_URL } from '../lib/config';

let provider
let signer 
let myAddress

let mySpace 

const MAINNET = 1

let chainId = null

let box
export { box }

export const LOAD_WEB3 = 'LOAD_WEB3'
export const LOAD_BOX3 = 'LOAD_BOX3'
export const WEB3_LOADING = 'WEB3_LOADING'
export const WEB3_LOADED = 'WEB3_LOADED'
export const BOX3_LOADED = 'BOX3_LOADED'
export const LOAD_BOX3_PENDING = 'LOAD_BOX3_PENDING'
export const LOAD_BOX3_COMPLETE = 'LOAD_BOX3_COMPLETE'
export const LOGIN_START = 'LOGIN_START'
export const LOGIN_COMPLETE = 'LOGIN_COMPLETE'
export const LOGOUT = 'LOGOUT'
export const LOGOUT_COMPLETE = 'LOGOUT_COMPLETE'

export const VISIT_SPACES = 'VISIT_SPACES'

export const CREATE_GROUP = 'CREATE_GROUP'
export const CREATE_GROUP_WEB3_BEGIN = 'CREATE_GROUP_WEB3_BEGIN'
export const CREATE_GROUP_WEB3_SUCCESS = 'CREATE_GROUP_WEB3_SUCCESS'

export const SPACES_LOAD = 'SPACES_LOAD'
export const SPACE_LOAD = 'SPACE_LOAD'
export const SPACE_LOAD_SUCCESS = 'SPACE_LOAD_SUCCESS'

export const LOAD_POSTS = "LOAD_POSTS"
export const SPACE_LOAD_POSTS = 'SPACE_LOAD_POSTS'
export const SPACE_LOAD_POSTS_SUCCESS = 'SPACE_LOAD_POSTS_SUCCESS'

export const SUBMIT_THING = 'SUBMIT_THING'

export const FETCH_PROFILE = 'FETCH_PROFILE'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'
export const FETCH_PROFILE_ETH_ADDRESS_SUCCESS = 'FETCH_PROFILE_ETH_ADDRESS_SUCCESS'

export const POST_MESSAGE = 'POST_MESSAGE'
export const GET_MESSAGES = 'GET_MESSAGES'
export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const MARK_MESSAGE_STATUS = 'MARK_MESSAGE_STATUS'

function getArtifact(name) {
    const artifact = require(`../chain/${name}.json`)
    return artifact
}

async function getDeployment(artifact) {
    let networks = artifact.networks
    let keys = Object.keys(artifact.networks)
    keys = keys.sort().reverse()
    if(keys.length === 0) throw new Error("no deployments")

    let deploy
    if(chainId) {
        deploy = networks[chainId]
        if(!deploy) throw new Error("no deployment")
    } else {
        deploy = networks[keys[0]]
    }
    
    return deploy.address.toLowerCase()
    
}


async function syncBox(box) {
    await new Promise((res, rej) => {
        box.onSyncDone(res)
    })
}

export function* loadWeb3() {
    yield put({
        type: WEB3_LOADING
    })
    const addresses = yield call(window.ethereum.enable)
    myAddress = addresses[0];
    // provider = new ethers.providers.Web3Provider(window.ethereum);
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner(0);
    // yield call(() => new Promise((res,rej) => {
    //     provider.on('ready', res)
    //     setTimeout(rej, 5000)
    // }))

    const network = yield call(() => provider.getNetwork())
    chainId = network.chainId
    // let network = yield call(provider.getNetwork)
    // chainId = MAINNET
    // chainId = MAINNET
    yield put({
        type: WEB3_LOADED,
        payload: {
            chainId,
        }
    })
}

export function* login() {
    yield call(loadBox3)

    yield call(async () => {
        await box.linkAddress()
        console.log(`ETH address linked`)

        // await box.syncDone
        // console.log(`3Box sync done`)

        const links = await box.listAddressLinks()
        if(!links.length) {
            throw new Error("Ethereum address not linked to 3Box profile, or proofs cannot be found.")
        }

        // Authenticate.
        const jwt = await ciaoWrapMessage({
            links
        })

        try {
            const response = await axios.post(`${API_URL}/users/authenticate`, { jwt })
            console.debug(response)
        } catch(ex) {
            console.error(ex)
        }
    })

    yield put({
        type: LOGIN_COMPLETE
    })
}

export function* logout() {
    yield put({
        type: LOGOUT_COMPLETE
    })
}

export function* loadBox3() {
    yield put({
        type: LOAD_BOX3_PENDING
    })

    box = yield call(Box.openBox, myAddress, window.ethereum)
    const myProfile = yield call(Box.getProfile, myAddress)

    // yield call(authenticateToCiaoDao)
    yield call(async () => {
        await box.linkAddress()
        console.log(`ETH address linked`)

        // await box.syncDone
        // console.log(`3Box sync done`)

        const links = await box.listAddressLinks()
        if(!links.length) {
            throw new Error("Ethereum address not linked to 3Box profile, or proofs cannot be found.")
        }

        // Authenticate.
        const jwt = await ciaoWrapMessage({
            links
        })

        try {
            const response = await axios.post(`${API_URL}/users/authenticate`, { jwt })
            console.debug(response)
        } catch(ex) {
            console.error(ex)
        }
    })

    // Now we can sign messages to go out to the server.
    // We identify the user solely by their DID,
    // since this contains claims of links to their Ethereum addresses.
    const authToken = yield call(async () => {
        return JSON.stringify(await ciaoWrapMessage({ ciao: 'hello' }))
    })
    axios.defaults.headers.common['Authorization'] = authToken
    console.log(authToken)

    // verifyJWT
    // signJWT

    const myDid = box.DID
    fetchProfile({ did: myDid })

    yield put({
        type: LOAD_BOX3_COMPLETE,
        payload: {
            // box,
            myProfile,
            myAddress,
            myDid
            // box, myProfile, myAddress
        }
    })

    yield call(persistor.flush)
}

/**
 * Ciaodao uses a very dumb client-server protocol integrated with 3Box's decentralized claims.
 * 
 * Messages are sent over HTTP, encapsulated in an envelope of a "claim". 
 * Claim isn't semantically the correct term, however it is the term used by DID-JWT.
 * Basically each message is signed by the user's DID, encapsulated in a JSON Web Token.
 * 
 * All HTTP REST endpoints accept a parameter "jwt", which contains a JWT Claim.
 */

export async function ciaoWrapMessage(message) {
    let jwt = await box._3id.signJWT({ message })
    return jwt
}

export function* visitSpaces() {
    Router.push('/spaces')
}

export function* createGroup({ payload }) {
    const { name, membershipType, addressDetails } = payload

    yield put({
        type: CREATE_GROUP_WEB3_BEGIN
    })

    const artifact = getArtifact('SpaceFactory')
    const addr = yield call(getDeployment, artifact)
    const contract = new ethers.Contract( 
        addr, 
        artifact.abi, 
        signer
    )
    
    let tx

    if(membershipType == MEMBERSHIP_TYPE_TOKEN) {
        tx = yield call(
            contract.functions.createERC20Space,
            name,
            addressDetails[0]
        )
    } else if(membershipType == MEMBERSHIP_TYPE_INVITE) {
        tx = yield call(
            contract.functions.createSpace,
            name,
            addressDetails
        )
    }

    let receipt = yield call(tx.wait)
    let spaceEvent = receipt.events.pop()

    let { args } = spaceEvent
    let { space } = args;
    
    yield put({
        type: CREATE_GROUP_WEB3_SUCCESS,
        payload: {
            name,
            space,
            chainId
        }
    })
}

export function* loadSpace({ spaceId }) {
    // check if registered members


}



export function* loadSpaces() {
    const spaces = yield select(state => state.spaces.data)
    
    // go through all and get updated metadata
    for(let space in Object.values(spaces)) {
        yield call(loadSpace, space.addr)
    }
}

// import { Resolver } from 'did-resolver-broke';
// import threeid from '3id-resolver';
// const { getResolver } = require('muport-did-resolver2')

async function getEthereumAddress(did, profile) {
    let validatedClaim = await Box.idUtils.verifyClaim(profile.proof_did, { audience: did })
    let record = validatedClaim.doc

    // let resolver = new Resolver({
    //     '3': () => threeid
    // })
    // let record = await resolver.resolve(did)
    
    for(let l of record.publicKey) {
        if(l.ethereumAddress) {
            return l.ethereumAddress
        }
    }
    console.error(record)
    throw new Error(`couldn't find ethereum address for did: ${did}`)
}

export function* loadPosts({ payload }) {
    const { posts, spaceAddress } = payload

    // Filter posts
    const spaceMembers = yield select(state => state.spaces.members)
    const unknownUsers = _.difference(
        getMembers(posts),
        spaceMembers
    )

    console.log(`New members:`)
    console.log(newMembers)

    // load profiles that we haven't loaded yet
    const artifact = getArtifact('Space')
    const contract = new ethers.Contract( 
        spaceAddress, 
        artifact.abi, 
        signer
    )

    let newMembers = []
    for(let did of unknownUsers) {
        let profile = yield call(Box.getProfile, did)
        let ethAddress = yield call(getEthereumAddress, did, profile)

        // check membership
        // TODO(liamz) fully implement contract-wise

        // let isMember = yield call(() => contract.functions.isMember(ethAddress))
        let isMember = true
        if(isMember || 1) newMembers.push({ did, ethAddress })
    }

    console.log(newMembers)

    // console.log(posts)

    // const { profiles } = this.props
    // const newUsers = Array.from(new Set(posts.map(post => post.author).filter(did => !profiles[did])))

    // newUsers.map(did => {
    //     Box.getProfile(did).then(profile => {
    //         this.props.addUserProfile(did, profile)
    //     })
    // })

    // filterPosts
}

// TODO HACKKKK
let fetchProfileInProgress = {}

export function* fetchProfile({ payload: { did } }) {
    if(fetchProfileInProgress[did]) return
    fetchProfileInProgress[did] = true

    let profile = yield call(Box.getProfile, did)
    let ethAddress = yield call(getEthereumAddress, did, profile)

    console.log(profile,ethAddress)

    let profileComplete = profile.name && profile.image.length
    if(profileComplete) {
        yield put({
            type: FETCH_PROFILE_SUCCESS,
            payload: {
                profile,
                did,
                ethAddress
            }
        })
    } else {
        // TODO nothing for now
    }


    /*
    A user with a 3box profile will return something like:
    {
        emoji: "😉"
        image: [{…}]
        memberSince: "Alpha"
        name: "Liam Zebedee"
        proof_did: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1NjcyNzQyMDksImlzcyI6ImRpZDptdXBvcnQ6UW1ZcVNHTEdYOWFWNTJNaUd4N29mZWpNdktoM3FzSjJ5U3JXQ3V3Mlhpa0prQSJ9.JRVlZ3sVlbUO_JrCa2_hWdQwwklTWLCkXNQnl_oYQU1bjqrCi3k8DgyNgbI2gnXPdaQwf8_ZJpAt3JRi7k6Qhg"
        proof_github: "https://gist.githubusercontent.com/liamzebedee/5407cac8e18f5c0cabfe47127556c7de/raw/3e8595c3a1a56a4311f8c2cf232fbccf7037046f/gistfile1.txt"
        proof_twitter: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1NjczNDE2MDYsInN1YiI6ImRpZDptdXBvcnQ6UW1ZcVNHTEdYOWFWNTJNaUd4N29mZWpNdktoM3FzSjJ5U3JXQ3V3Mlhpa0prQSIsImNsYWltIjp7InR3aXR0ZXJfaGFuZGxlIjoibGlhbXplYmVkZWUiLCJ0d2l0dGVyX3Byb29mIjoiaHR0cHM6Ly90d2l0dGVyLmNvbS9saWFtemViZWRlZS9zdGF0dXMvMTE2ODE0MTQ2Mzk3ODQ2MzIzNSJ9LCJpc3MiOiJkaWQ6aHR0cHM6dmVyaWZpY2F0aW9ucy4zYm94LmlvIn0.CaRRGs7nZnOFV0bmmkrCHYEFK3bV27g7lGsVh6035aPxykolXKG5USRWUA0tOwz_WJTCcxqrzm1wy7ELN4XLqw"
        website: "https://24-7.dev"
    }

    whereas one without will look like:
    {
        memberSince: "Alpha"
        proof_did: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1NjY3MTExMzUsImlzcyI6ImRpZDptdXBvcnQ6UW1SVE5QZWZtRmdhNjhHbnpZUHpRUjNac1lZTmRRb1RWZ0tDcHVCalpRclJUWiJ9.Sy366ESexD3JQ0qgNggsavWWcFk92mmfjvez9vMVUKE6wTf9gfWzG4Y5oOZHPb4s9hVVF9JErSleqaHpCx4MVA"
    }

    */
}

function* postMessage({ payload }) {
    const {
        space,
        content,
        time
    } = payload.message

    const message = {
        space,
        content,
        time
    }

    let myDid = yield select(state => state.data.myDid)

    // Sign and post to Ciao node.
    const jwt = yield call(async () => {
        return await ciaoWrapMessage({
            message
        })
    })

    const messageId = web3.utils.sha3(jwt)
    
    // Optimistic UI.
    yield put({
        type: ADD_MESSAGE,
        payload: {
            ...message,
            
            // Add the author
            author: {
                did: myDid
            },
            messageId,

            status: "sending"
        }
    })

    yield call(async () => {
        try {
            const response = await axios.post(`${API_URL}/spaces/${space}/messages`, { jwt })
            console.debug(response)
        } catch(ex) {
            console.error(ex)
        }

    })

    yield put({
        type: MARK_MESSAGE_STATUS,
        payload: {
            messageId,
            status: "sent"
        }
    })
}

export function* getMessages({ payload }) {
    const { spaceId } = payload
    // let [state, setState] = useState({
    //     messages: []
    // })

    const messages = yield call(async () => {
        let url = `${API_URL}/spaces/${spaceId}/messages`
        let res = await axios.get(url)
        return res.data
    })

    yield put({
        type: GET_MESSAGES_SUCCESS,
        payload: messages.map(message => {
            return {
                ...message,
                space: spaceId
            }
        })
    })


    // async function getMessages() {
    //     let url = `${API_URL}/spaces/${spaceId}/messages`

    //     let res = await axios.get(url)
        
    //     console.log(res.data)
        

    //     setState({
    //         messages: res.data
    //     })
    // }
}

export default function* () {
    yield takeLatest(LOAD_WEB3, loadWeb3)
    yield takeLatest(LOAD_BOX3, loadBox3)
    yield takeLatest(LOGIN_START, login)
    yield takeLatest(VISIT_SPACES, visitSpaces)
    yield takeLatest(CREATE_GROUP, createGroup)
    // yield takeLatest(SPACES_LOAD, loadSpaces)
    // yield takeLatest(LOAD_POSTS, loadPosts)

    yield takeLatest(POST_MESSAGE, postMessage)
    yield takeLatest(GET_MESSAGES, getMessages)

    yield takeEvery(FETCH_PROFILE, fetchProfile)
    yield takeEvery(LOGOUT, logout)
}
