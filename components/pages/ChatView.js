
import React, { Component, useState, useEffect, useReducer } from "react";
import Post from "../atoms/Post";
import { PostMessageInput } from "../atoms/PostMessageInput"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postMessage } from '../../actions'
import { getMessagesForSpace } from "../../selectors";

const ChatView = ({
    spaceId,
    messages,
    postMessage
}) => {
    return <>
        {
            messages.map(message => <Post {...message}/>)
        }

        <PostMessageInput onSubmit={ev => {
            postMessage({
                text: ev.text,
                time: new Date,
                space: spaceId
            })
        }}/>
    </>
}



function mapStateToProps(state, props) {
    return {
        messages: getMessagesForSpace(state, props.spaceId)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postMessage
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatView)
