import Box from "3box";
import React, { Component, useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { addUserProfile, loadSpace, loadPosts } from "../../actions";
import { box, ciaoWrapMessage } from "../../sagas";
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

const ViewSpace = ({ addr }) => {
  let [state, setState] = useState({
    isMember: false,
    members: []
  });
  let [joiningSpace, setJoiningSpace] = useState(false);
  let [pane, setPane] = useState("home");
  let content = null;

  // Get space info,
  async function getSpaceInfo() {
    let url = `${API_URL}/spaces/${addr}`;

    let res = await axios.get(url);

    console.log(res.data);
    let { name, isMember, latestMessage, members } = res.data;

    setState({
      isMember,
      latestMessage,
      members
    });
  }

  useEffect(() => {
    getSpaceInfo();
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
    spaceId: props.addr
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewSpace);
