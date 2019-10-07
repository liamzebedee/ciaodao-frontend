
import React, { useState } from "react";
import styled from 'styled-components';
import { Form, Button } from "react-bootstrap";
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

const PostThingForm = styled.div`

textarea { 
    background-color: rgba(0, 0, 0, 0.0315);
}
.filledIn {
    background-color: white;
}
textarea:focus::placeholder {
    color: #aaa;
}
textarea::placeholder {
    color: #aaa;
}

`


const PostThing = ({ web3Loading, box3Loading, submitThing }) => {
    const [text, setText] = useState('')
    const [submitted, setSubmitted] = useState(false)

    let filledIn = text && 'filledIn'

    return <div>
        <PostThingForm>
            <style>
            
            </style>
            <Form.Control 
                className={`${filledIn}`} placeholder="What's up?" as="textarea" rows="2" value={text} 
                onChange={ev => setText(ev.target.value)}
                />
            
            <Button onClick={async () => {
                setSubmitted(true)
                submitThing(text)
            }} disabled={(web3Loading || box3Loading) || submitted}>👋 ciao</Button>
        </PostThingForm>
    </div>
}

function mapStateToProps(state, props) {
    return {
        web3Loading: state.flows.WEB3_LOADING,
        box3Loading: state.flows.BOX3_LOADING
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