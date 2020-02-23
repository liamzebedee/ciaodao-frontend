import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../actions";
import { getProfile } from '../../selectors'
import { useEffect } from "react";

export function useProfile(did) {
    const dispatch = useDispatch()
    const profile = useSelector(state => getProfile(state, did))
    if(!profile) {
        dispatch(fetchProfile(did))
        // useEffect(() => {
        //     dispatch(fetchProfile(did))
        // })
        return { loading: true }
    }
    return { loading: false, profile }
}