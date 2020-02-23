import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import Box from '3box';
import { fetchProfile, showUserProfile } from '../../actions'

import { useState, useEffect } from 'react'
import { isRegExp } from 'util';
import { getProfile, getEthAddress } from '../../selectors';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useProfile } from '../hooks'

import css from "./profile-tile.less";

const anonProfile = '/static/anonymous.jpg'



const LazyProfileTile = ({ did, ethAddress, fetchProfile }) => {
    // if(!profile) {
    //     useEffect(() => {
    //         fetchProfile(did)
    //     }, [])
    //     return null
    // }

    let { loading, profile } = useProfile(did)

    let image = anonProfile

    if(!loading) {
        if(profile.image && profile.image.length) {
            image = `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
        }
    }
    
    return <div className={css.profileTile} onClick={showUserProfile}>
        <div>
                <img
                src={image}
                className="profile-img"
                alt="profile"
                />
        </div>
    </div>
}


function mapStateToProps(state, props) {
    // let profile = getProfile(state, props.did)
    // let ethAddress = getEthAddress(state, props.did)
    return {}
    // return {
    //     profile,
    //     ethAddress
    // }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            // fetchProfile,
            showUserProfile
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyProfileTile)
