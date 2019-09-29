
// import React, { Component } from 'react';
// import {
//   Switch,
//   Route,
//   withRouter
// } from 'react-router-dom';
import Box from '3box';

import Cover from '../3box/Cover';


import React, { Component } from 'react'



const Box3Context = React.createContext({})




export class KebabChain extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loggedIn: false,
      box: {},
      chatSpace: {},
      myAddress: '',
      myDid: '',
      myProfile: {},
      isAppReady: false,
      topicList: [],
      topicManager: {},
      disableLogin: false,
    };
  }

  componentDidMount() {
    const { box } = this.state;

    // if you haven't openedBox, return to login
    this.setState({ isAppReady: true });
    window.ethereum.enable()
  }


  render() {
    const {
      isAppReady,
      chatSpace,
      topicManager,
      topicList,
      myProfile,
      myAddress,
      myDid,
      disableLogin,
      loggedIn
    } = this.state;

    const contextValue = {
        myProfile,
      myAddress,
      myDid,
    }

    return (
        <Box3Context.Provider value={contextValue}>
            {this.props.children}
        </Box3Context.Provider>
    );
  }
}


export function with3Box(Child) {
    return (props) => (
        <Box3Context.Consumer>
            {(props2) => <Child {...props} {...props2} />}
        </Box3Context.Consumer>
    )
}
