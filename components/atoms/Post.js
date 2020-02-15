import LazyProfileTile from "./LazyProfileTile"
import { getProfile, getEthAddress } from "../../selectors"
import { bindActionCreators } from "redux"
import { connect } from 'react-redux'
import spotifyStyleTime from 'spotify-style-times'

import css from './post.less'

const Post = ({ time, content, messageId, author, profile, myDid }) => {
    const humanTime = spotifyStyleTime(new Date(time))
    return <div className={`${css.post} ${myDid == author.did && css.selfpost}`} key={messageId}>
        <div className={css.author}>
            <LazyProfileTile did={author.did}/>
        </div>
        
        <div className={css.body}>
            <span className={css.profileName}>{(profile && profile.name) || `Unknown#${author.did.slice(-6)}`}</span>
        
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

export default connect(mapStateToProps, mapDispatchToProps)(Post)
