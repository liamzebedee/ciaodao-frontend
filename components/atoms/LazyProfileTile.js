import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import Box from '3box';
import { fetchProfile, showUserProfile } from '../../actions'

import { useState, useEffect } from 'react'
import { isRegExp } from 'util';
import { getProfile, getEthAddress } from '../../selectors';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import css from "./profile-tile.less";

const anonProfile = '/static/anonymous.jpg'



const LazyProfileTile = ({ did, profile, ethAddress, fetchProfile, showUserProfile }) => {
    if(!profile) {
        useEffect(() => {
            fetchProfile(did)
        })
    }

    let image

    if(profile) {
        image = `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
    }

    // TODO load ethAddress for any profile in sep reducer
    // return  <div className={css.profileTile}>
    //     <div>
    //         <a href={profile ? `https://3box.io/${ethAddress}` : ''} disabled={profile} target="_blank" rel="noopener noreferrer">
    //             <img
    //             src={profile ? image : anonProfile}
    //             className="profile-img"
    //             alt="profile"
    //             />
    //         </a>
    //     </div>
    // </div>
    return <div className={css.profileTile} onClick={showUserProfile}>
        <div>
                <img
                src={profile ? image : anonProfile}
                className="profile-img"
                alt="profile"
                />
        </div>
    </div>
}


function mapStateToProps(state, props) {
    let profile = getProfile(state, props.did)
    let ethAddress = getEthAddress(state, props.did)

    return {
        profile,
        ethAddress
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            fetchProfile,
            showUserProfile
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyProfileTile)
