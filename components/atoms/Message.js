import LazyProfileTile from "./LazyProfileTile"
import { getProfile, getEthAddress } from "../../selectors"
import { bindActionCreators } from "redux"
import { connect } from 'react-redux'
import spotifyStyleTime from 'spotify-style-times'
import { profileName } from '../shared'
import css from './message.less'
import { useProfile } from "../hooks"

const Message = ({ time, content, messageId, author, myDid }) => {
    const humanTime = spotifyStyleTime(new Date(time))
    const { did } = author
    let { profile, loaded } = useProfile(did)

    return <div className={`${css.message} ${myDid == did && css.selfpost}`} key={messageId}>
        <div className={css.author}>
            <LazyProfileTile did={did}/>
        </div>
        
        <div className={css.body}>
            <span className={css.profileName}>{ profileName(profile, did) }</span>
        
            <div className={css.content}>
                {content}
                {/* <footer className='meta'>
                    <small>{humanTime}</small>
                </footer> */}
            </div>
        </div>
    </div>
}



function mapStateToProps(state, props) {
    let profile = getProfile(state, props.author)
    return {
        profile,
        myDid: state.data.myDid
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Message)
