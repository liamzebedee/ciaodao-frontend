
import React, { Component, useState, useEffect, useReducer, useRef } from "react";
import Post from "./Message";
import { PostMessageInput } from "./PostMessageInput"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postMessage, getMessages } from '../../actions'
import { getMessagesForSpace } from "../../selectors";

import { API_URL } from '../../lib/config';
import axios from 'axios';

import _ from 'lodash'
// import useResizeObserver from 'use-resize-observer'

import css from './chat-view.less'
import Message from "./Message";

const ChatView = ({
    spaceId,
    messages,
    getMessages,
    postMessage
}) => {
    const chatviewEl = useRef(null);

    useEffect(() => {

    //     const ro = new ResizeObserver(entries => {
    //         let x = entries[0]
    //         x.scrollTop = x.scrollHeight - x.clientHeight;
    //     });
    //     ro.observe(chatviewEl.current)

        getMessages(spaceId)
    }, [])


    const observer = useRef(
        new ResizeObserver(entries => {
            // Only care about the first element, we expect one element ot be watched
            //   const { width } = entries[0].contentRect;
        
            //   setBreakSize(findBreakPoint(breakpoints, width));
            const x = entries[0]
            const { target } = x

            target.parentElement.scrollTop += 10000

            console.log(x)
            // target.parent.scrollTop = target.scrollHeight - target.clientHeight;
            // target.parent.scrollTop += 1000
        })
      );
    
      useEffect(() => {
        if (chatviewEl.current) {
          observer.current.observe(chatviewEl.current);
        }
    
        return () => {
          observer.current.unobserve(chatviewEl.current);
        };
      }, [chatviewEl, observer]);

    //   const { chatviewEl } = useResizeObserver({
    //     onResize: ({ width, height }) => {
    //       // do something here.
    //       console.log(123)
    //     }
    //   });



    return <div className={css.chatView} >
        <div className={css.conversation}>
            <div ref={chatviewEl}>
                {
                    _.orderBy(messages, ['time'], ['asc'])
                    .map(message => <Message {...message}/>)
                }
            </div>

        </div>

        <div className={css.postMessage}>
        <PostMessageInput onSubmit={ev => {
            postMessage({
                content: ev.text,
                time: new Date,
                space: spaceId
            })
        }}/>
        </div>
    </div>
}



function mapStateToProps(state, props) {
    return {
        messages: getMessagesForSpace(state, props.spaceId)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postMessage,
            getMessages
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatView)
