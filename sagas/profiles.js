import { call, put, takeLatest, select, fork, cancelled, take, takeEvery, takeLeading } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import Box from '3box';
import Router from 'next/router'
import { persistor } from '../pages/_app';
import Web3 from 'web3';
import { ethers, ContractFactory } from 'ethers';
import { MEMBERSHIP_TYPE_TOKEN, MEMBERSHIP_TYPE_INVITE } from '../components/pages/SpacesPage';
import { submitThing } from '../actions';
import { getMembers } from '../selectors';
import { FETCH_PROFILE_SUCCESS } from '.';


// import { Resolver } from 'did-resolver-broke';
// import threeid from '3id-resolver';
// const { getResolver } = require('muport-did-resolver2')

export async function getEthereumAddress(did, profile) {
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

// TODO HACKKKK
let fetchProfileInProgress = {}

export function* fetchProfile({ payload: { did } }) {
    if(fetchProfileInProgress[did]) return
    fetchProfileInProgress[did] = true

    let profile = yield call(Box.getProfile, did)
    let ethAddress = yield call(getEthereumAddress, did, profile)

    console.log('Fetch profile:', profile, ethAddress)

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