import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import React from 'react'

import css from './sidebar.less'
import { TheStore } from './TheStore'
import LazyProfileTile from "./LazyProfileTile"
import { useProfile } from '../hooks'
import { profileName } from '../shared'

const Sidebar = ({ name = "", tokenAddress = "", members = [] }) => {
    return <div className={css.sidebar}>
        <h2>The Ciao DAO ({name})</h2>
        <pre>{tokenAddress}</pre>

        <section className={css.members}>
            <h3>{members.length} members</h3>
            <div className={css.memberList}>
                { members.map(({ did, addresses }) => {
                    let { profile, loading } = useProfile(did)
                    return <div className={css.member}>
                        <div className={css.profileTile}><LazyProfileTile did={did}/></div>

                        <div className={css.details}>
                            <div className={css.name}>{ profileName(profile, did) }</div>
                            <div className={css.address}><pre>{addresses[0].address}</pre></div>
                        </div>
                    </div>
                }) }
            </div>
        </section>

        {/* <button type="button" className={`btn btn-primary`}>
            Send
        </button>

        <button type="button" className={`btn btn-primary`}>
            Request
        </button>

        <button type="button" className={`btn btn-primary`}>
            Mint
        </button>

        <button type="button" className={`btn btn-primary`}>
            Propose
        </button> */}


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