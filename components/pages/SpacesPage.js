import React, { useState } from "react";
import { connect } from 'react-redux'

import styled from 'styled-components';
import PageTemplate from "./PageTemplate"
import { useRouter } from 'next/router'


import { Modal, Button, Form, ButtonGroup, FormControl, ButtonToolbar } from 'react-bootstrap'
import Link from 'next/link'
import { bindActionCreators } from "redux";
import { createSpace } from '../../actions'
import Spaces from "../containers/Spaces";
import { format } from "util";
import { Router } from "next/router";

import LoggedInUser from '../atoms/LoggedInUser'


export const MEMBERSHIP_TYPE_TOKEN = 'token'
export const MEMBERSHIP_TYPE_INVITE = 'invite'

const PreTextarea = styled.div`
    textarea {
        font-family: monospace;
    }
`

const Layout = styled.div`
padding-top: 3rem;
padding-left: 2rem;

header {
    display: flex;
    justify-content: left;
}

.button-toolbar {
    button:not(:first-child) { 
        margin-left: .5em;
    }
}
`

const addresses = [
    '0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4',
    '0xb794F5eA0ba39494cE839613fffBA74279579268'
]
const memes = [
    'OopsIKilledIt',
    'Bitconeeeeeect',
    'toThEMooN'
]
const memedAddresses = addresses.map((addr, i) => {
    const meme = memes[i]
    return addr.slice(0, addr.length - meme.length) + meme
})


function Page({ createSpace, form }) {
    const router = useRouter()
    

    const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
    const [showSearchSpacesModal, setShowSearchSpacesModal] = useState(false);

    const [submitted, setSubmitted] = useState(false)
    const [modalReset, setModalReset] = useState(+new Date)
    const [name, setName] = useState('')
    const [membershipType, setMembershipType] = useState('')
    const [addressDetails, setAddressDetails] = useState([])

    function handleSubmit() {
        setSubmitted(true)
        createSpace(name, membershipType, addressDetails)
    }


    function renderMembershipType() {
        let onChange = (ev) => {
            const str = ev.target.value
            const addresses = str.split('\n')
            setAddressDetails(addresses)
        }
    
        switch(membershipType){
            case MEMBERSHIP_TYPE_TOKEN:
                return <div>
                    <small>Enter an ERC20/ERC721 token:</small>
                    <PreTextarea><Form.Control type="text" placeholder={memedAddresses[0]} onChange={onChange}/></PreTextarea>
                </div>
            case MEMBERSHIP_TYPE_INVITE:
                return <div>
                    <small>Add Ethereum addresses:</small>
                    <PreTextarea><Form.Control as="textarea" rows="3" placeholder={memedAddresses.join('\n')} onChange={onChange}/></PreTextarea>
                </div>
            default:
                return null
        }
    }

    let title;
    let body;
    let footer = <Modal.Footer>
        <Button variant="secondary" disabled={submitted} onClick={() => {
            setShowCreateSpaceModal(false)
        }}>
            Cancel
        </Button>
        
        <Button variant="primary" disabled={submitted || !(name != "" && membershipType != "" && addressDetails.length > 0)} onClick={handleSubmit}>
            Submit
        </Button>

    </Modal.Footer>

    if(form.step == 'success') {
        title = 'Space created!'
        body = <div>
            {/* <Button variant="secondary" onClick={() => {
                setShowCreateSpaceModal(false)
            }}>
                Back to spaces
            </Button>
             */}
            <Button variant="primary" onClick={() => {
                router.push(`/spaces/${form.space}`)
            }}>
                Go to space
            </Button>
        </div>
        footer = null
    } else {
        title = 'Create a space'
        body = <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label><i className="fas fa-layer-group"></i> Name</Form.Label>
                <Form.Control type="text" placeholder="Döner DAO" onChange={(ev) => setName(ev.target.value)}/>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label><i className='fa fa-user'/> How can people join?</Form.Label>
                
                <div>
                <ButtonGroup>
                <Button variant="outline-primary" active={membershipType == MEMBERSHIP_TYPE_TOKEN} onClick={() => {
                    setMembershipType(MEMBERSHIP_TYPE_TOKEN)
                }}>
                By token
                </Button>

                <Button variant="outline-secondary" active={membershipType == MEMBERSHIP_TYPE_INVITE} onClick={() => {
                    setMembershipType(MEMBERSHIP_TYPE_INVITE)
                }}>
                By invite
                </Button>
                </ButtonGroup>
                </div>
                
                <br/>
                {renderMembershipType(membershipType)}
                
            </Form.Group>
        </Form>
    }

    return <PageTemplate className="container">
        <Layout>
            <header>
                <LoggedInUser withDropdown={true}/> 
            </header>

            <h1>Spaces</h1>
            <ButtonToolbar className='button-toolbar'>
                <Button variant="primary" onClick={() => {
                    setSubmitted(false)
                    setName('')
                    setMembershipType('')
                    setAddressDetails([])
                    setShowCreateSpaceModal(true)
                }}>Create space</Button> 
                
                <Button variant="secondary" onClick={() => {
                    setShowSearchSpacesModal(true)
                }}>Find spaces</Button>
            </ButtonToolbar>
            

            <Modal 
                show={showCreateSpaceModal} 
                onHide={() => {
                    setShowCreateSpaceModal(false)
                    setModalReset(+new Date)
                }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                {footer}
            </Modal>

            <SearchSpacesModal
                shown={showSearchSpacesModal}
                onHide={() => {
                    setShowSearchSpacesModal(false)
                    setModalReset(+new Date)
                }}/>

            <br/>
            
            <h2>My spaces</h2>
            <Spaces/>
        </Layout>
    </PageTemplate>
}

const SearchSpacesModal = ({ shown, onHide }) => {
    let [searching, setSearching] = useState(false)
    function searchForSpaces() {}

    return <Modal 
        show={shown} 
        onHide={onHide}
        width={800}
        >
        <Modal.Header closeButton>
            <Modal.Title>Find spaces</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control type="text" placeholder="e.g. 0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359 (DAI)" />
            <Button variant="primary" disabled={searching} onClick={searchForSpaces}>
                <i className="fas fa-search"></i> Search
            </Button>

        </Modal.Body>
    </Modal>
}

function mapStateToProps(state, props) {
    return {
        ...state.data,
        form: state.flows['FLOW_CREATE_GROUP']
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createSpace
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)