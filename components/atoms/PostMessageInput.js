
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import css from './post-message-input.less'

const PostMessageInput = ({ onSubmit }) => {
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
            value={text} 
            onKeyDown={handleKeyDown} 
            onChange={ev => setText(ev.target.value)}
            rows={3}
            placeholder="Ciao, hello, bonjour, g'day, hoi..."
        ></textarea>
    </div>
}

export { PostMessageInput }