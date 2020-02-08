import React, { Component } from "react";
import { loadWeb3 } from "../../actions";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import { MyLoader } from "../atoms/MyLoader";


class Web3Wrapper extends Component {
    componentDidMount() {
        this.props.loadWeb3()
    }

    render() {
        let { loading } = this.props
        return <div>
        {loading 
            ? this.props.children
            : <MyLoader/>
            }
        </div>
    }
}


function mapStateToProps(state, props) {
    return {
        loading: state.flows.WEB3_LOADING == false
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            loadWeb3
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Web3Wrapper)