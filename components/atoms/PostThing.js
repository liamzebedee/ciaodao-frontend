
import React, { useState } from "react";
import styled from 'styled-components';
import { Form, Button } from "react-bootstrap";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import useApiRequest from "../../hooks/apiRequest";
import { box } from '../../sagas'
import { API_URL } from "../../lib/config";
import { SUCCESS } from "../../reducers/loading";


import axios from 'axios'

const PostThingForm = styled.div``


const PostThing = ({ spaceId }) => {
    const [text, setText] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const submitThing = async (message) => {
        try {
            let jwt = await box._3id.signJWT({
                message: {
                    type: 'text',
                    text: message
                },
            })

            const response = await axios.post(`${API_URL}/spaces/${spaceId}/messages`, {
                jwt
            })
            
            setText('')
            setSubmitted(false)
        } catch(ex) {
            console.error(ex)
        }
    }

    return <div>
        <PostThingForm>
            <Form.Control as="textarea" rows="3" value={text} onChange={ev => setText(ev.target.value)}/>
            
            <Button onClick={async () => {
                setSubmitted(true)
                submitThing(text)
            }} disabled={submitted}>👋 ciao</Button>
        </PostThingForm>
    </div>
}

function mapStateToProps(state, props) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PostThing)