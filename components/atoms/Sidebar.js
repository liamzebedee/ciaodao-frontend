import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import React from 'react'

import css from './sidebar.less'
import { TheStore } from './TheStore'
import LazyProfileTile from "./LazyProfileTile"
import { useProfile } from '../hooks'
import { profileName, toEtherscanLink } from '../shared'
import { useState } from "react"
import { Modal } from "react-bootstrap"

const Sidebar = ({ name = "", tokenName, tokenAddress = "", members = [] }) => {
    let [showInviteModal, setShowInviteModal] = useState(false)

    return <div className={css.sidebar}>
        <h2>{name}</h2>
        <div className=''>
            {
                tokenName
                ? <span>For holders of the <a href={toEtherscanLink({ token: tokenAddress })}><strong>${tokenName}</strong> token</a>.</span>
                : <span>For holders of a token at <a href={toEtherscanLink({ token: tokenAddress })}>{tokenAddress}</a>.</span>
            }
        </div>

        <div className={css.actionBar}>
            <button type="button" className={`btn btn-primary`} onClick={() => {
                setShowInviteModal(true)
            }}>
                Invite
            </button>
        </div>

        <section className={css.members}>
            <h3>{members.length} members</h3>
            <div className={css.memberList}>
                { members.map(({ did, addresses }) => {
                    let { profile, loading } = useProfile(did)
                    return <div key={did} className={css.member}>
                        <div className={css.profileTile}><LazyProfileTile did={did}/></div>

                        <div className={css.details}>
                            <div className={css.name}>{ profileName(profile, did) }</div>
                            <div className={css.address}><pre>{addresses[0].address}</pre></div>
                        </div>
                    </div>
                }) }
            </div>
        </section>

        <InviteModal shown={showInviteModal}/>
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


const InviteModal = ({ shown, onHide }) => {
    let [searching, setSearching] = useState(false)

    return <Modal
        show={shown} 
        onHide={onHide}
        width={800}
        >
        <Modal.Header closeButton>
            <Modal.Title>Invite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            

        </Modal.Body>
    </Modal>
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