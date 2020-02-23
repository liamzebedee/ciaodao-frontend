import LazyProfileTile from "./LazyProfileTile"
import { getProfile, getEthAddress } from "../../selectors"
import { bindActionCreators } from "redux"
import { connect } from 'react-redux'
import spotifyStyleTime from 'spotify-style-times'
import { profileName } from '../shared'
import css from './message.less'

const Message = ({ time, content, messageId, author, profile, myDid }) => {
    const humanTime = spotifyStyleTime(new Date(time))
    return <div className={`${css.message} ${myDid == author.did && css.selfpost}`} key={messageId}>
        <div className={css.author}>
            <LazyProfileTile did={author.did}/>
        </div>
        
        <div className={css.body}>
            <span className={css.profileName}>{ profileName(profile, author.did) }</span>
        
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
