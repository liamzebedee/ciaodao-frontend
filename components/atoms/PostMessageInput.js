
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'



const PostMessageInput = ({ onSubmit }) => {
    let [text, setText] = useState('')

    function handleKeyDown(ev) {
        if(ev.key == 'Enter' && !ev.shiftKey) {
            onSubmit({ text })
            setText('')
            ev.preventDefault()
        }
    }

    return <>
        <textarea 
            value={text} 
            onKeyDown={handleKeyDown} 
            onChange={ev => setText(ev.target.value)}
        ></textarea>
    </>
}

export { PostMessageInput }