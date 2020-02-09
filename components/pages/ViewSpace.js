import Box from '3box';
import React, { Component, useState, useEffect } from "react";
import { Card, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import styled from 'styled-components';
import { addUserProfile, loadSpace, loadPosts } from '../../actions';
import { box, ciaoWrapMessage } from "../../sagas";
import LazyProfileTile from "../atoms/LazyProfileTile";
import PageTemplate from "./PageTemplate";
import css from "./space.less";
import PostThing from '../atoms/PostThing';
import { filterPosts, getMembers } from '../../selectors';

import Post from '../atoms/Post';
import useApiRequest from '../../hooks/apiRequest';
import { API_URL } from '../../lib/config';
import { FETCHING, SUCCESS } from '../../reducers/loading';
import ChatView from './ChatView'

const ViewSpace = ({ addr }) => {
    let [pane, setPane] = useState('home')
    let content = null

    let name = 'The Greatest Space In The Worrrrrld'

    return <PageTemplate>
        <div className={css.page}>
        
            <header>
                <a href="/spaces">
                    <i class="fas fa-arrow-circle-left"></i> Back to spaces    
                </a>
            </header>
            
            <ChatView spaceId={addr}/>
        </div>
        
    </PageTemplate>
}



function mapStateToProps(state, props) {
    return {
        spaceId: props.addr,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewSpace)