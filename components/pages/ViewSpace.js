import Box from "3box";
import React, { Component, useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { addUserProfile, loadSpace, loadPosts, loadBox3 } from "../../actions";
import { box, ciaoWrapMessage, GET_MESSAGES_SUCCESS } from "../../sagas";
import LazyProfileTile from "../atoms/LazyProfileTile";
import PageTemplate from "./PageTemplate";
import css from "./space.less";
import PostThing from "../atoms/PostThing";
import { filterPosts, getMembers } from "../../selectors";

import useApiRequest from "../../hooks/apiRequest";
import { API_URL } from "../../lib/config";
import { FETCHING, SUCCESS } from "../../reducers/loading";
import axios from "axios";
import Sidebar from "../atoms/Sidebar";
import ChatView from "../atoms/ChatView";

import io from 'socket.io-client'

const ViewSpace = ({ loadBox3, addr, authToken }) => {
  let [state, setState] = useState({
    isMember: false,
    members: []
  })
  let [joiningSpace, setJoiningSpace] = useState(false)
  let [pane, setPane] = useState("home")
  let content = null

  // Get space info,
  async function getSpaceInfo() {
    let url = `${API_URL}/spaces/${addr}`;
    axios.defaults.headers.common['Authorization'] = authToken
    let res = await axios.get(url);

    console.log(res.data);
    let { name, id, tokenAddress, isMember, latestMessage, members, tokenName } = res.data;

    setState({
      name,
      id,
      tokenAddress,
      tokenName,
      isMember,
      latestMessage,
      members
    });
  }

  const dispatch = useDispatch()

  function listenForMessages() {
      const realtimeSpace = io(`${API_URL}/spaces/${addr}`, { reconnection: true });

      realtimeSpace.on('connect', function () {
          console.log('Connected to WebSocket API')
      })
      
      realtimeSpace.on('message', function (message) {
          console.log('socket', message)
          
          dispatch({
              type: GET_MESSAGES_SUCCESS,
              payload: [
                // TODO HACK HACK HACK
                {
                  ...message,
                  space: addr
                }
              ]
          })
      })
  }

  useEffect(() => {
    loadBox3()
    getSpaceInfo()
    listenForMessages()
  }, []);

  async function joinSpace() {
    setJoiningSpace(true);
    let url = `${API_URL}/spaces/${addr}/join`;
    const jwt = await ciaoWrapMessage({ ciao: "hello " });
    let res = await axios.post(url, { jwt });
    console.log(res);

    await getSpaceInfo();

    setJoiningSpace(false);
    // console.log(res.data)
    // let {
    //     isMember,
    //     latestMessage
    // } = res.data
  }

  return (
    <PageTemplate>
      <div className={css.page}>
        <header>
          <a href="/spaces">
            <i class="fas fa-arrow-circle-left"></i> Back to spaces
          </a>
        </header>

        <div className={css.ctn}>
          {!state.isMember ? (
            <div>
              <button
                type="button"
                className={`btn btn-primary`}
                disabled={joiningSpace}
                onClick={joinSpace}
              >
                Join space
              </button>{" "}
            </div>
          ) : (
            <>
              <ChatView spaceId={addr} />
              <div className={css.sidebar}>
                <Sidebar {...state} />
              </div>
            </>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

function mapStateToProps(state, props) {
  return {
    spaceId: props.addr,
    authToken: state.data.authToken
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadBox3
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewSpace);
