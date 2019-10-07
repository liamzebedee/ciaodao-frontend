import ContentLoader from "react-content-loader"
import React, { Component, useState } from "react";
import { connect } from 'react-redux'

import styled from 'styled-components';
import { useRouter } from 'next/router'


import { Modal, Button, Form, ButtonGroup, Card, Dropdown } from 'react-bootstrap'
import Link from 'next/link'
import { bindActionCreators } from "redux";

import { format } from "util";
import { Router } from "next/router";

import { submitThing, toggleSaved } from '../../actions'


import css from "../pages/space.less";
import PostThing from "./PostThing";
import { filterPosts } from "../../selectors";
import Post from "./Post";
import Web3Wrapper from "../wrapper/Web3Wrapper";
import Box3Wrapper from "../wrapper/Box3Wrapper";
import { BasicSpinner } from "./BasicSpinner";

// TOGGLE_SPACE_SAVED

const Feed = ({ space, submitThing, posts, postThingKey, toggleSaved }) => {
    // const [postThingKey, setPostThingKey] = useState(0)
 
    const [showMenu, setShowMenu] = useState(false)

    return <div className={css.feed}>
        <div className={`${css.card} heading`}>
        
            <h3 className='title'>{space.name}</h3>
            

            <Dropdown className={'dropdown'} drop="down" alignRight show={showMenu} onToggle={(isOpen) => {
                setShowMenu(isOpen)
            }}>
                {/* <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    <i class="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle> */}
                <div onClick={() => setShowMenu(!showMenu)} className="toggleEllipsis rounded mr-2">
                    <i class="fas fa-ellipsis-v"></i>
                </div>

                <Dropdown.Menu >
                    <Dropdown.Item onClick={() => toggleSaved(!space.saved)}>
                        {
                            space.saved 
                            ? <><i class="fas fa-star"></i> Unfavourite</>
                            : <><i class="far fa-star"></i> Favourite</>
                        }
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            
            {/* <div>
            <Button size="sm" variant="primary">
                Save
            </Button>
            </div> */}

            {/* <BasicSpinner loading={1}/> */}
        </div>

        <div className={`${css.card} ${css.composer} composer`}>
            <PostThing key={postThingKey} submitThing={async (message) => {
                try { 
                    submitThing(message)
                    // setTimeout(() => {
                    //     setPostThingKey(postThingKey+1)
                    // })
                    
                }
                catch(ex) {
                    console.error(ex)
                }
            }}/>
        </div>
        
        
        { 
        posts.length
        ? filterPosts(posts).map(post => <Post key={post.postId} {...post}/>)
        : <div className={css.nothingHere}>
            {/* <i class="fas fa-smile-wink"></i> */}
            {/* <i class="fas fa-door-open"></i> */}
            {/* <i class="far fa-stars"></i> */}
            <i className={`${css.starryNight} icon-starry-night`}></i>
            <p>This space looks a bit empty.</p>
            {/* <br/><i>Why not make some noise?</i> */}
            {/* Looks like you've stumbled upon an empty space. */}
        </div> 
        }        

        <footer></footer>
    </div>
}

// export default Feed

function mapStateToProps(state, props) {
    return {
        postThingKey: state.flows.FLOW_SUBMIT_THING.id
    }
}

function mapDispatchToProps(dispatch, props) {
    return bindActionCreators(
        {
            toggleSaved: (saved) => toggleSaved(props.space.ethAddress, saved)
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)