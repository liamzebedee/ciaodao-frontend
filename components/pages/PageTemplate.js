import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'

import styled from 'styled-components';
import Head from 'next/head'

const AppTitle = styled.h1`
    text-transform: lowercase;
    font-family: 'Audiowide', cursive;
    color: #333;
    align-self: center;
    flex: 1;
    padding-right: 1rem;
    padding-left: 1rem;
    font-size: 16px;

    :hover {
        cursor: pointer;
    }
`
const HeaderBar = styled.div`
    padding: 2rem;
    background: #eee;
    display: flex;
    flex-direction: row;
`

const Col = `
    display: flex;
    flex-direction: column;
    flex-flow: row wrap;
`
const ColL = styled.div`
    ${Col}
    justify-self: flex-start;
    flex: 1;
`
const ColR = styled.div`
    ${Col}
    justify-self: flex-end;
    justify-items: flex-end;
    align-content: center;
`

const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
`

const SearchStyle = styled.div`
    flex: 1;
`

const LoadingBar = styled.div`
    height: 4px;
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #ddd;

  :before {
    display: block;
    position: absolute;
    content: "";
    left: -200px;
    width: 200px;
    height: 4px;
  }

  .loading {
    background-color: #2980b9;
    animation: loading 2s linear infinite;
  }
  
  @keyframes loading {
      from {left: -200px; width: 35%;}
      50% {width: 20%;}
      to {left: 100%;}
  }
`

const Style = styled.div`
html {
    width: 100%;
    height: 100%;
    margin: 0;
}

width: 100%;
height: 100vh;
display: flex;
flex-direction: column;
`

import { useRouter } from 'next/router'
import { withRouter } from 'next/router'
import Link from 'next/link'

import axios from 'axios'

function Home({ children, loading, authToken }) {
    // TODO: HACK HACK HACK
    useEffect(async () => {
        axios.defaults.headers.common['Authorization'] = authToken
    }, [])

    return <Style className="container-fluid">
        <Head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
        </Head>

        {children}
    </Style>
}

function mapStateToProps(state, props) {
    return {
        loading: state.loading,
        authToken: state.data.authToken,
    }
}



export default connect(mapStateToProps, null)(Home)