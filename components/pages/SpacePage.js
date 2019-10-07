import Box from '3box';
import React, { Component, useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import styled from 'styled-components';
import { loadSpace, loadPosts, submitThing } from '../../actions';
import { box } from "../../sagas";
import LazyProfileTile from "../atoms/LazyProfileTile";
import PageTemplate from "./PageTemplate";
import css from "./space.less";
import { filterPosts, getMembers } from '../../selectors';
import { BasicSpinner } from '../atoms/BasicSpinner'
import Feed from '../atoms/Feed'

const Layout = styled.div`
width: 100%;
display: flex;

flex: 1;


& > .left {
    flex: .8;
    padding-top: 1em;
    
    max-width: 40em;
}
& > .right {
    flex: 0 .2;
    padding: 1em 0;
    padding-right: 2em;
    
}
.menuitems .fas {
    width: 20px;
    text-align: center;
}

`



                {/* <div className='right'>
                    <Card>
                        <ListGroup style={{ width: '18rem' }} variant="flush" className='menuitems'>
                            <ListGroup.Item action onClick={() => this.setState({ view: views.home })} active={view == views.home}>
                                <i className="fas fa-home"></i>  Home
                            </ListGroup.Item>

                            <ListGroup.Item action onClick={() => this.setState({ view: views.members })}active={view == views.members}>
                                <i className="fas fa-user"></i>  Members
                            </ListGroup.Item>

                            <ListGroup.Item action onClick={() => this.setState({ view: views.about })}active={view == views.about}>
                                <i className="fas fa-info"></i>  About
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </div> */}



const Members = ({ posts }) => {
    let members = getMembers(posts)
    return <div>
        {
            members.map(did => <LazyProfileTile did={did}/>)
        }
    </div>
}

import Post from '../atoms/Post';
import Head from 'next/head';
import { FLOW_LOAD_SPACE } from '../../reducers/flows';

class SpacePage extends Component {
    state = {
        view: 0
    }

    async componentDidMount() {
        const { addr } = this.props
        this.props.loadSpace(addr)
    }

    render() {
        const { addr, submitThing, space, error } = this.props
        
        let name = space.name || 'Loading...'
        let posts = space.posts || []
        
        const { view } = this.state
        const views = {
            home: 0,
            members: 1,
            about: 2
        }

        let content
        switch(view) {
            case views.home:
                // content = <Feed submitThing={(text) => {
                //     submitThing(addr, 'chat', text)
                // }} {...{ posts, space }}/>
                
                break
            case views.members:
                content = <Members {...{ posts }}/>
                break;
            case views.about:
                content = <div>
                    This space exists at {this.props.addr}.
                </div>
                break;
        }

        return <PageTemplate>
            <Head>
                <title>{name}</title>
            </Head>

            <div className={css.page}>
            
            <header>
                <a href="/spaces">
                {/* {`<<`}  */}
                <i class="fas fa-arrow-circle-left"></i> Back to spaces
                </a>
            </header>

            <Modal
                size="lg"
                show={error}
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Couldn't load space!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {error}
                    </p>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button >Close</Button>
                </Modal.Footer> */}
                </Modal>

            <Layout>
                <div className='left'>
                    <Feed 
                        space={this.props.space} 
                        submitThing={(text) => {
                            submitThing(addr, 'chat', text)
                        }} 
                        posts={posts}
                    />
                </div>
            </Layout>
            </div>
            
        </PageTemplate>
    }
}


function mapStateToProps(state, props) {
    return {
        space: state.spaces[props.addr] || {},
        error: state.flows['FLOW_LOAD_SPACE'].error
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            loadSpace,
            loadPosts,
            submitThing
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(SpacePage)