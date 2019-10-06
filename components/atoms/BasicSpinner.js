import { Spinner } from "react-bootstrap"
import styled from 'styled-components'
const style = styled.div`
width: 24px;
height: 24px;
margin-top: 3px;
`
const BasicSpinner = ({ loading }) => {
    return <>
        {
            loading
            ? <Spinner animation="border" variant="primary"/>
            : null
        }
    </>
}

export { BasicSpinner }