import LandingPage from '../components/pages/LandingPage'
import { connect } from 'react-redux'
import React, { Component } from 'react';

class Container extends Component {
    componentDidMount() {
    }

    render() {
        return <>
            <LandingPage/>
        </>
    }
}


function mapStateToProps(state, ownProps) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)