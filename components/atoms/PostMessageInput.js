
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import css from './post-message-input.less'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const PostMessageInput = ({ onSubmit, loadingBox3 }) => {
    let [text, setText] = useState('')

    function handleKeyDown(ev) {
        if(ev.key == 'Enter' && !ev.shiftKey) {
            if(text == '') {
                ev.preventDefault()
                return
            }
            onSubmit({ text })
            setText('')
            ev.preventDefault()
        }
    }

    return <div className={css.postMessage}>
        <textarea 
            disabled={loadingBox3}
            value={text} 
            onKeyDown={handleKeyDown} 
            onChange={ev => setText(ev.target.value)}
            rows={2}
            placeholder="Ciao, hello, bonjour, g'day, hoi..."
        ></textarea>
    </div>
}


function mapStateToProps(state, props) {
    return {
        loadingBox3: state.data.loadingBox3
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMessageInput)
