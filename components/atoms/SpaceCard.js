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

export const SpaceCard = ({ name, ethAddress }) => {
    return <Card className={'m-3'} style={{ width: '300px' }}>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        {/* <p className="card-text"><small className="text-muted">last active today &middot; 4 members</small></p> */}
        <a href={`/spaces/${ethAddress}`} className="btn btn-dark">Open group</a>
      </div>
    </Card>
}



function mapStateToProps(state, props) {
  let space = state.spaces[props.addr]

  return {
    space
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      {
      },
      dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SpaceCard)

