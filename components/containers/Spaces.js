
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

import css from './spaces.less'
import { selectSpaces } from "../../selectors";




const axios = require('axios');




import useApiRequest from '../../hooks/apiRequest'
import { API_URL } from '../../lib/config'
import { FETCHING, SUCCESS } from "../../reducers/loading";
import { MyLoader } from '../atoms/MyLoader'

const Spaces = ({ myDid, data = [] }) => {
  const [{ status, response }, makeRequest] = useApiRequest(`${API_URL}/users/${myDid}/spaces`, { verb: 'get' })
  useEffect(() => {
    makeRequest()
  }, [])

  return <div>
    {status === FETCHING && (
      <MyLoader/>
    )}
    {status === SUCCESS && (
      <CardColumns className={css.spaces}>
      { 
        data.map((d, i) => <SpaceCard {...d} key={i} />)
      }
      </CardColumns>
    )}
  </div>
}

function mapStateToProps(state, props) {
  return {
      myDid: state.data.myDid,
      data: selectSpaces(state),
      loading: false
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