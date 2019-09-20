import LazyProfileTile from "./LazyProfileTile"
import { getProfile, getEthAddress } from "../../selectors"
import { bindActionCreators } from "redux"
import { connect } from 'react-redux'
import spotifyStyleTime from 'spotify-style-times'

const Post = ({ timestamp, message, postId, author, ethAddress, profile }) => {
    const humanTime = spotifyStyleTime(new Date(timestamp*1000))
    return <div className='post' key={postId}>
        <div className='left'>
            <LazyProfileTile did={author}/>
        </div>

        <div className='right'>
            <span className="profile-name mt-0">{(profile && profile.name) || `Unknown#${author.slice(-6)}`}</span>
            <div>{message}</div>
        </div>

        <div className='meta'>
            <small>{humanTime}</small>
        </div>
    </div>
}



function mapStateToProps(state, props) {
    let profile = getProfile(state, props.author)
    // let ethAddress = getEthAddress(state, props.author)

    return {
        profile,
        // ethAddres
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
