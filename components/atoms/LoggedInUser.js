import makeBlockie from 'ethereum-blockies-base64';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap';
import LazyProfileTile from "./LazyProfileTile"
import { logout } from '../../actions'
import Router from 'next/router'
import { ProfileTile } from './ProfileTile';



const Style = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;

    .media {
        align-items: left;
        text-align: left;
    }
    
    img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        margin-right: 1rem;
    }
`

class UserProfileToggle extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    
    handleClick = (e) => {
        e.preventDefault();

        this.props.onClick(e);
    }
      
    render() {
        const { myDid, myAddress, myProfile } = this.props
        const profile = myProfile
        return <div className="media">
            <div onClick={this.handleClick}>
              <ProfileTile profile={myProfile} did={myDid} address={myAddress}/>

              {/* <EditProfile
                  // required
                  box={box}
                  space={space}
                  currentUserAddr={myAddress}

                  // optional
                  customFields={customFields}
                  currentUser3BoxProfile={myProfile}
                  redirectFn={redirectFn}
              /> */}
    
            </div>
            <div>
              <strong>{(profile && profile.name) || `Unknown#${myDid.slice(-6)}`}</strong>
              <br/>{myAddress}
            </div>
        </div>
    }
}




class CustomMenu extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleChange = this.handleChange.bind(this);
  
      this.state = { value: '' };
    }
  
    handleChange(e) {
      this.setState({ value: e.target.value.toLowerCase().trim() });
    }
  
    render() {
      const {
        children,
        style,
        className,
        'aria-labelledby': labeledBy,
      } = this.props;
  
      const { value } = this.state;
  
      return (
        <div style={style} className={className} aria-labelledby={labeledBy}>
          <ul className="list-unstyled" style={{ marginBottom: 0 }}>
            {React.Children.toArray(children).filter(
              child =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    }
  }
  

class Component extends React.Component {
  render() {
    const { myAddress, myDid, myProfile, logout, loggedIn, withDropdown } = this.props
    if(!loggedIn) return null

    return <Style>
      { withDropdown 
        ? <Dropdown>
            <Dropdown.Toggle as={(props) => <UserProfileToggle {...{myAddress, myDid, myProfile, ...props}}/>} id="dropdown-custom-components">
              Custom toggle
            </Dropdown.Toggle>
      
            <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Header>Your profile</Dropdown.Header>
              <Dropdown.Item eventKey="1" href={`https://3box.io/${myAddress}`}>
                  <i className="fas fa-portrait"></i> Edit details
                </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="2" onSelect={() => logout()}>
                <i className="fas fa-sign-out-alt"></i> Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        : <UserProfileToggle onClick={() => {}} {...{myAddress, myDid, myProfile}}/>
      }
    </Style>
  }
}

function mapStateToProps(state, props) {
    let { myAddress, myProfile, myDid, loggedIn } = state.data
    return {
        myAddress,
        myProfile,
        myDid,
        loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
          logout
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)

