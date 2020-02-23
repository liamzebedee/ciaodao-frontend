
import React, { Component, useState, useEffect } from "react";
import { connect } from 'react-redux'

import styled from 'styled-components';
import { useRouter } from 'next/router'


import { Modal, Button, Form, ButtonGroup, CardColumns } from 'react-bootstrap'
import Link from 'next/link'
import { bindActionCreators } from "redux";
import { createSpace, loadSpaces } from '../../actions'

import { format } from "util";
import { Router } from "next/router";

import { SpaceCard } from '../atoms/SpaceCard'

import { selectSpaces } from "../../selectors";




const axios = require('axios');




import useApiRequest from '../../hooks/apiRequest'
import { API_URL } from '../../lib/config'
import { FETCHING, SUCCESS } from "../../reducers/loading";
import { MyLoader } from '../atoms/MyLoader'



import css from './spaces.less'

const Spaces = ({ myDid, authToken }) => {
  // const [{ status, response }, makeRequest] = useApiRequest(`${API_URL}/users/${myDid}/spaces`, { verb: 'get' })
  const [state, setState] = useState({
    status: FETCHING,
  })

  async function loadSpaces() {
    let url = `${API_URL}/users/${myDid}/spaces`

    axios.defaults.headers.common['Authorization'] = authToken
    let res = await axios.get(url)
    
    console.log(res.data)
    let spaces = res.data

    setState({
      status: SUCCESS,
      spaces
    })
  }

  useEffect(() => {
    // makeRequest()

    
    loadSpaces()

  }, [])

  return <div>
    {state.status === FETCHING && (
      <MyLoader/>
    )}
    {state.status === SUCCESS && (
      <div className={css.spaces}>
      { state.spaces.map((d, i) => <SpaceCard {...d} key={i} />) }
      </div>
    )}
  </div>
}

function mapStateToProps(state, props) {
  return {
      myDid: state.data.myDid,
      authToken: state.data.authToken
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      {
        loadSpaces
      },
      dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Spaces)