import React from 'react';

import styled from 'styled-components'

const Style = styled.div`
    border: 1px solid #eee;
    box-shadow: 1px 1px solid black;
    padding: 15px;
    display: inline-flex;

    .amount,
    .coin {
        font-weight: 700;
    }
`

const ChatSpace = () => {
    return <Style>
        <span>
            <span className='amount'>200</span> <span className='amount'>LOVE</span> for <span className='amount'>services from last night</span>.
        </span>
    </Style>
}

export { ChatSpace }