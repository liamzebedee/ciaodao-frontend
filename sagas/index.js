import { call, put, takeLatest, select, fork, cancelled, take, takeEvery, takeLeading } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import Box from '3box';
import Router from 'next/router'
import { persistor } from '../pages/_app';
import Web3 from 'web3';
import { ethers, ContractFactory } from 'ethers';
import { MEMBERSHIP_TYPE_TOKEN, MEMBERSHIP_TYPE_INVITE } from '../components/pages/SpacesPage';
import { getMembers } from '../selectors';
// import Router from 'next/router'

import {
    fetchProfile, getEthereumAddress
} from './profiles'

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

export const VISIT_SPACES = 'VISIT_SPACES'

export const CREATE_GROUP = 'CREATE_GROUP'
export const CREATE_GROUP_WEB3_BEGIN = 'CREATE_GROUP_WEB3_BEGIN'
export const CREATE_GROUP_WEB3_SUCCESS = 'CREATE_GROUP_WEB3_SUCCESS'

export const LOAD_SPACE = 'LOAD_SPACE'
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

export const USER_LOGOUT_BEGIN = 'USER_LOGOUT_BEGIN'
export const USER_LOGOUT = 'USER_LOGOUT'

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
    provider = new ethers.providers.Web3Provider(web3.currentProvider)
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

export function* loadBox3() {
    yield put({
        type: LOAD_BOX3_PENDING
    })
    
    // get my box and profile
    box = yield call(Box.openBox, myAddress, window.ethereum, {})
    const myProfile = yield call(Box.getProfile, myAddress)
    const myDid = box.DID

    yield put({
        type: LOAD_BOX3_COMPLETE,
        payload: {
            // box,
            myProfile,
            myAddress,
            myDid,
            loggedIn: true
            // box, myProfile, myAddress
        }
    })

    yield call(persistor.flush)
}

export function* visitSpaces() {
    Router.push('/spaces')
}

export function* createGroup({ payload }) {
    const { name, membershipType, addressDetails } = payload

    yield put({
        type: CREATE_GROUP_WEB3_BEGIN
    })

    const artifact = getArtifact('SpaceCadetFactory')
    const addr = yield call(getDeployment, artifact)
    const contract = new ethers.Contract( 
        addr, 
        artifact.abi, 
        signer
    )
    
    let tx

    if(membershipType == MEMBERSHIP_TYPE_TOKEN) {
        tx = yield call(
            contract.functions.createTokenSpace,
            name,
            addressDetails[0]
        )
    } else if(membershipType == MEMBERSHIP_TYPE_INVITE) {
        tx = yield call(
            contract.functions.createPersonalSpace,
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

    // yield loadSpace(space)
}

export function* loadSpaces() {
    const spaces = yield select(state => state.spaces.data)
    
    // go through all and get updated metadata
    // for(let space in Object.values(spaces)) {
    //     yield call(loadSpace, space.addr)
    // }
}


let openedSpaces = {}


export async function openSpace(addr) {
    let space = openedSpaces[addr]

    if(!space) {
        // open 3chat space
        space = await box.openSpace(`ciaodao:space:${addr}`)
    }

    return space
}

const TEMPORARY_MODERATOR = 'did:muport:QmRTNPefmFga68GnzYPzQR3ZsYYNdQoTVgKCpuBjZQrRTZ'
export function* loadSpace({ payload }) {
    const { addr } = payload

    const space = yield call(openSpace, addr)

    const thread = yield call(() => space.joinThread('posts', { 
        members: false,
        firstModerator: TEMPORARY_MODERATOR
    }))
    

    // console.log(`Loading posts`)
    const posts = yield call(() => thread.getPosts())

    // console.log(`${posts.length} posts loaded`)
    // this.setState({
    //     posts
    // })
    // this.props.loadPosts(posts, addr)

    yield fork(loadPosts, {
        payload: {
            spaceAddress: addr,
            posts,
        }
    })

    const threadUpdate = watchThreadPosts(thread)
    while(true) {
        yield take(threadUpdate)
        const posts = yield call(() => thread.getPosts())
        yield fork(loadPosts, {
            payload: {
                spaceAddress: addr,
                posts,
            }
        })
    }
}

function watchThreadPosts(thread) {
    return eventChannel(emitter => {
        thread.onUpdate(res => {
            // Redux Saga Event Channels will ERROR on null/undefined values
            emitter({ res })
        })
        return () => {
            // unsub
            return true
        }
    })
}



export function* loadPosts({ payload }) {
    const { posts, spaceAddress } = payload

    if(!posts.length) return

    yield put({
        type: SPACE_LOAD_POSTS_SUCCESS,
        payload: {
            addr: spaceAddress,
            posts,
        }
    })

    console.log(`Loading post metadata (profiles etc.)`)

    // Filter posts
    const spaceMembers = yield select(state => state.spaces.members)
    const unknownUsers = _.difference(
        getMembers(posts),
        spaceMembers
    )

    console.log(`New members:`)
    console.log(newMembers)

    // load profiles that we haven't loaded yet
    const artifact = getArtifact('ISpace')
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

    // SPACE_LOAD_POSTS_SUCCESS
}



export function* logout() {
    // yield call(persistor.pause)
    yield put({
        type: USER_LOGOUT
    })
    Router.push('/')
}

export function* watchLoadSpace(action) {
    // yield takeEvery(LOAD_SPACE, loadSpace)
    const watched = {}

    while (true) {
        const action = yield take(action => {
            return action.type == LOAD_SPACE && 
                !watched[action.payload.addr]
        })

        watched[action.payload.addr] = yield fork(loadSpace, action)
    }
}

export function* submitThing({ payload }) {
    const { spaceAddress, threadKey, text } = payload

    const space = yield call(openSpace, spaceAddress)

    const thread = yield call(() => space.joinThread('posts', { 
        members: false,
        firstModerator: TEMPORARY_MODERATOR
    }))

    yield call(() => thread.post(text))
    
    yield put({
        type: 'foo'
    })
}


export default function* () {
    yield takeLatest(LOAD_WEB3, loadWeb3)
    yield takeLatest(LOAD_BOX3, loadBox3)
    yield takeLatest(VISIT_SPACES, visitSpaces)
    yield takeLatest(CREATE_GROUP, createGroup)
    yield takeLatest(SPACES_LOAD, loadSpaces)
    yield takeLatest(SUBMIT_THING, submitThing)
    yield takeLatest(LOAD_POSTS, loadPosts)
    yield takeEvery(FETCH_PROFILE, fetchProfile)
    yield takeLatest(USER_LOGOUT_BEGIN, logout)
    yield fork(watchLoadSpace)
}
