// import SpacePage from '../../components/pages/SpacePage'
import ViewSpace from '../../components/pages/ViewSpace'
import Box3Wrapper from '../../components/wrapper/Box3Wrapper';
import Web3Wrapper from '../../components/wrapper/Web3Wrapper';
import { useRouter } from 'next/router';


export default () => {
    const router = useRouter()
    const { addr } = router.query

    return <Web3Wrapper>
        <Box3Wrapper>
            <ViewSpace {...{addr}}/>
        </Box3Wrapper>
    </Web3Wrapper>
}