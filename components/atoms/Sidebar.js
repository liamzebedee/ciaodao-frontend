import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import React from 'react'

import css from './sidebar.less'
import { TheStore } from './TheStore'

const Sidebar = () => {
    return <div className={css.sidebar}>
        <h2>Sidecar DAO</h2>
        <p>12 members</p> <pre>0x38b8639d03D2367BbA4B66e1880DC847729AE1B1</pre>
        

        <button type="button" className={`btn btn-primary`}>
            Send
        </button>

        <button type="button" className={`btn btn-primary`}>
            Request
        </button>

        <button type="button" className={`btn btn-primary`}>
            Propose
        </button>


    </div>
}


function mapStateToProps(state, props) {
    return {
        myDid: state.data.myDid
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)