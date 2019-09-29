import { Spinner } from "react-bootstrap"

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