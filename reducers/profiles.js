import { FETCH_PROFILE_SUCCESS } from "../sagas"


const initialState = {
    ethAddresses: {},
    box3Profiles: {}
}


export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_PROFILE_SUCCESS:
            const { payload: { did, profile, ethAddress } } = action
            return {
                ...state,
                box3Profiles: {
                    [did]: profile
                },
                ethAddresses: {
                    [did]: ethAddress
                }
            }
        default:
            return state
    }
}