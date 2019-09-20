import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import Box from '3box';
import { fetchProfile } from '../../actions'

import { useState, useEffect } from 'react'
import { isRegExp } from 'util';
import { getProfile, getEthAddress } from '../../selectors';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const anonProfile = '/static/anonymous.jpg'

const LazyProfileTile = ({ did, profile, ethAddress, fetchProfile }) => {
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
    return  <div className="profile-tile">
        <div className="profileTile_info">
            <a href={profile ? `https://3box.io/${ethAddress}` : ''} disabled={profile} className="profileTile_info_link" target="_blank" rel="noopener noreferrer">
                <img
                style={{ width: 49, height: 49 }}
                src={profile ? image : anonProfile}
                className="profile-img"
                alt="profile"
                />
            </a>
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
            fetchProfile
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyProfileTile)
