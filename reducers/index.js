import spaces from './spaces'
import data from './data'
import flows from './flows'
import profiles from './profiles'
import messages from './messages'

import { combineReducers } from 'redux'

export default combineReducers({
    spaces,
    data,
    flows,
    profiles,
    messages
})