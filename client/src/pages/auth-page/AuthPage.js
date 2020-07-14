import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import store from '../../redux/store';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useQuery} from "../../utils/hooks";
import {
    googleGetToken,
    googleGetUserInfo,
    register,
    localLogin,
    reroute,
    instagramGetToken,
    instagramGetUserInfo, setPreloadDone
} from "../../redux/actions/app";
import './auth-page.scss';
import {AUTH_TYPE, ROUTES, ACCOUNT_TYPE} from "../../utils/enums";

function AuthPage({type}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {dispatch} = store;

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const queryParams = useQuery();
    const {authType} = useParams();

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc Only once, get the code and fetch access token.
     */
    useEffect(() => {
        const code = queryParams.get("code");
        let successCallback = () => {};
        dispatch(setPreloadDone(false));
        const setDone = () => dispatch(setPreloadDone(true));
        switch(type) {
            case ACCOUNT_TYPE.GOOGLE:
                successCallback = () => {
                    dispatch(googleGetUserInfo(() => {// 2) Token --> User Info
                        if (authType === AUTH_TYPE.REGISTER) {
                            const failureCallback = () => {
                                dispatch(reroute(ROUTES.REGISTER));
                            };
                            return dispatch(register({ // 3a) Register Google Account
                                type, failureCallback,
                                successCallback: setDone
                            }));
                        }
                        const failureCallback = () => {
                            dispatch(reroute(ROUTES.LOGIN));
                        };
                        return dispatch(localLogin({
                            type, failureCallback,
                            successCallback: setDone
                        })); // 3b) Login Google Account
                    }));
                };
                dispatch(googleGetToken({code, authType, successCallback})); // 1) Code --> Token
                break;
            default:
                break;
        }
    },[]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    return null;
}

export default AuthPage;