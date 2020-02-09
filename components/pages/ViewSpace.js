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


const ViewSpace = ({ addr }) => {
    let [pane, setPane] = useState('home')
    let content = null

    let name = 'The Greatest Space In The Worrrrrld'

    return <PageTemplate>
        <div className={css.page}>
        
            <header>
                <a href="/spaces">{`<<`} Back to spaces</a>
            </header>
            
            <h1>
                {name}
            </h1>            
            
            <div className={css.layout}>
                <div className='right'>
                    <Card>
                        {/* <Card.Header>
                            <p>You're not a member.</p>
                        </Card.Header> */}
                        <ListGroup style={{ width: '18rem' }} variant="flush" className='menuitems'>
                            <ListGroup.Item action onClick={() => setPane('home')} active={pane == 'home'}>
                                <i className="fas fa-home"></i>  Home
                            </ListGroup.Item>

                            <ListGroup.Item action onClick={() => setPane('members')} active={pane == 'members'}>
                                <i className="fas fa-user"></i>  Members
                            </ListGroup.Item>

                            <ListGroup.Item action onClick={() => setPane('about')} active={pane == 'about'}>
                                <i className="fas fa-info"></i>  About
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div>

                <div className='left'>
                    {content}
                </div>
            </div>
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