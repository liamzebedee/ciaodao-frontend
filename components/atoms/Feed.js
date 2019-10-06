import ContentLoader from "react-content-loader"
import React, { Component, useState } from "react";
import { connect } from 'react-redux'

import styled from 'styled-components';
import { useRouter } from 'next/router'


import { Modal, Button, Form, ButtonGroup, Card } from 'react-bootstrap'
import Link from 'next/link'
import { bindActionCreators } from "redux";

import { format } from "util";
import { Router } from "next/router";

import { submitThing } from '../../actions'


import css from "../pages/space.less";
import PostThing from "./PostThing";
import { filterPosts } from "../../selectors";
import Post from "./Post";
import Web3Wrapper from "../wrapper/Web3Wrapper";
import Box3Wrapper from "../wrapper/Box3Wrapper";
import { BasicSpinner } from "./BasicSpinner";

const Feed = ({ space, submitThing, posts }) => {
    const [postThingKey, setPostThingKey] = useState(0)

    return <div className={css.feed}>
        <div className={`heading`}>
            <h3 className='title'>{space.name}</h3>
            {/* <BasicSpinner loading={1}/> */}
        </div>

        <div className={`${css.composer} composer`}>
            <PostThing key={postThingKey} submitThing={async (message) => {
                try { 
                    submitThing(message)
                    setPostThingKey(postThingKey+1)
                }
                catch(ex) {
                    console.error(ex)
                }
            }}/>
        </div>
        
        { posts
        ? filterPosts(posts).map(post => <Post key={post.postId} {...post}/>)
        : null }        

        <footer></footer>
    </div>
}

export default Feed

// function mapStateToProps(state, props) {
//     return {
//         space: state.spaces[props.addr],
//         profiles: state.spaces.profiles
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators(
//         {
//         },
//         dispatch
//     )
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Feed)