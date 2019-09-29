import Box from '3box';
import React, { Component, useState, useEffect } from "react";
import { Card, ListGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import styled from 'styled-components';
import { loadSpace, loadPosts, submitThing } from '../../actions';
import { box } from "../../sagas";
import LazyProfileTile from "../atoms/LazyProfileTile";
import PageTemplate from "./PageTemplate";
import css from "./space.less";
import PostThing from '../atoms/PostThing';
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






const Members = ({ posts }) => {
    let members = getMembers(posts)
    return <div>
        {
            members.map(did => <LazyProfileTile did={did}/>)
        }
    </div>
}

import Post from '../atoms/Post';

class SpacePage extends Component {
    state = {
        thread: null,
        posts: null,
        postThingKey: 0,
        view: 0
    }

    async componentDidMount() {
        const { addr } = this.props
        this.props.loadSpace(addr)
    }

    render() {
        const { space, thread } = this.state
        const { addr, submitThing } = this.props
        const { name, posts } = this.props.space

        // const name = space && space.name || 'unnamed'
        const { view, postThingKey } = this.state

        const views = {
            home: 0,
            members: 1,
            about: 2
        }

        let content
        switch(view) {
            case views.home:
                content = <Feed submitThing={(text) => {
                    submitThing(addr, 'chat', text)
                }} {...{ thread, posts }}/>
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
            <div className={css.page}>
            
            <header>
                <a href="/spaces">{`<<`} Back to spaces</a>
            </header>
            
            <h1>
                {/* <Button variant="primary">Join</Button>&nbsp; */}
                {name}
            </h1>
            
            <Layout>
                <div className='right'>
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
                </div>

                <div className='left'>
                    {content}
                </div>
            
            </Layout>
            </div>
            
        </PageTemplate>
    }
}


function mapStateToProps(state, props) {
    return {
        space: state.spaces.data[props.addr],
        profiles: state.spaces.profiles
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