import {APP, LOCAL_LOGIN, REGISTER, TOKEN_FETCH, LOGOUT, SEARCH_PROFILES, SEARCH_GIF, GOOGLE_GET_TOKEN,
    GOOGLE_GET_USER_INFO, INSTAGRAM_GET_TOKEN, INSTAGRAM_GET_USER_INFO} from './actionTypes';
import {AuthAPI, MainAPI} from "../../api/api";
import {ROUTES, SNACKBAR_SEVERITY, ACCOUNT_TYPE} from '../../utils/enums';
import {bufferToBase64, isEmptyProfile, setUpUserInfo} from "../../utils";
import {emptyProfile, getProfile} from "./profile";

export function createError(err) {
    return {
        type: APP.SET_ERROR,
        data: {err}
    };
}

export function setKeyboardShortcuts(keyboardShortcuts) {
    return {
        type: APP.SET_KEYBOARD_SHORTCUTS,
        data: {keyboardShortcuts}
    };
}


export function setInProgress(inProgress) {
    return {
        type: APP.SET_IN_PROGRESS,
        data: {inProgress}
    }
}

export function reroute(route) {
    return {
        type: APP.REROUTE,
        data: {route}
    }
}

export function snackbarMessage({message, type}) {
    const snackbar = {message, type};
    return {
        type: APP.SNACKBAR_MESSAGE,
        data: {snackbar}
    }
}

export function setBackdrop(backdropElement) {
    return {
        type: APP.OPEN_BACKDROP,
        data: {backdropElement}
    }
}

export function setBackdrop2(backdropElement2) {
    return {
        type: APP.OPEN_BACKDROP_2,
        data: {backdropElement2}
    }
}

export function setSearch(searchTag) {
    return {
        type: APP.SET_SEARCH,
        data: {searchTag, currentIndex: 0}
    }
}

export function setCurrentIndex(currentIndex) {
    return {
        type: APP.SET_CURRENT_INDEX,
        data: {currentIndex}
    }
}

export function setIndex(currentIndex) {
    return {
      type: APP.CURRENT_INDEX,
      data: {currentIndex}
    };
}

export function setPreloadDone(preloadDone) {
    return {
        type: APP.SET_PRELOAD_DONE,
        data: {preloadDone}
    };
}

export function setStartSearch(startSearch) {
    return {
        type: APP.SET_START_SEARCH,
        data: {startSearch}
    };
}

export function localLogin({email, password, type = ACCOUNT_TYPE.LOCAL, successCallback = () => {},
                            failureCallback = () => {}}) {
    const initial = () => ({
        type: LOCAL_LOGIN.IN_PROGRESS
    });

    const success = ({accessToken}) => ({
       type: LOCAL_LOGIN.SUCCESS,
       data: {accessToken}
    });

    const failure = err => ({
       type: LOCAL_LOGIN.FAILURE,
       err
    });

    return (dispatch, getState) => {
        dispatch(initial());
        const [localEmail, localPass] = setUpUserInfo({getState, password, email, type, failure, dispatch});
        dispatch(setPreloadDone(false));
        AuthAPI.login({email: localEmail, password: localPass}).then(res => {
            dispatch(success(res.data));
            dispatch(getProfile( () => {
                dispatch(reroute(ROUTES.FIND_PEOPLE));
                dispatch(setPreloadDone(true));
            }));
            successCallback && successCallback();
        }).catch(res => {
            dispatch(setPreloadDone(true));
            failureCallback && failureCallback();
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function register({email, password, type = ACCOUNT_TYPE.LOCAL, failureCallback = () => {}}) {

    const initial = () => ({
        type: REGISTER.IN_PROGRESS
    });

    const success = ({accessToken}) => ({
        type: REGISTER.SUCCESS,
        data: {accessToken}
    });

    const failure = err => ({
        type: REGISTER.FAILURE,
        err
    });

    return (dispatch, getState) => {
        dispatch(initial());
        const [localEmail, localPass] = setUpUserInfo({getState, password, email, type, failure, dispatch});
        dispatch(setPreloadDone(false));

        AuthAPI.register({email: localEmail, password: localPass}).then(({data}) => {
            dispatch(success(data));
            dispatch(reroute(ROUTES.NEXT_STEPS));
            dispatch(setPreloadDone(true));
        }).catch(res => {
            dispatch(setPreloadDone(true));
            failureCallback && failureCallback();
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function fetchNewToken({successCallback, failureCallback}) {

    const initialTokenFetch = () => ({
        type: TOKEN_FETCH.IN_PROGRESS
    });

    const successTokenFetch = ({accessToken}) => ({
        type: TOKEN_FETCH.SUCCESS,
        data: {accessToken}
    });

    const failureTokenFetch = err => ({
        type: TOKEN_FETCH.FAILURE,
        err
    });

    return dispatch => {
        dispatch(initialTokenFetch());
        AuthAPI.getNewToken().then(res => {
            dispatch(successTokenFetch(res.data));
            successCallback && successCallback();
        }).catch(res => {
            failureCallback && failureCallback();
            dispatch(failureTokenFetch(res));
        });
    }
}

export function logout(successCallback) {

    const initialLogout = () => ({
        type: LOGOUT.IN_PROGRESS
    });

    const successLogout = () => ({
        type: LOGOUT.SUCCESS
    });

    const failureLogout = err => ({
        type: LOGOUT.FAILURE,
        err
    });

    return dispatch => {
        dispatch(initialLogout());
        dispatch(setPreloadDone(false));

        AuthAPI.logout().then(() => {
            dispatch(successLogout());
            dispatch(emptyProfile());
            dispatch(reroute(ROUTES.LOGIN));
            successCallback && successCallback();
            dispatch(setPreloadDone(true));
        }).catch(res => {
            dispatch(failureLogout(res));
        });
    }
}

export function searchProfiles({offset = 0, limit = 25, tags= '', successCallback, failureCallback}) {

    const initial = () => ({
        type: SEARCH_PROFILES.IN_PROGRESS
    });

    const success = profiles => {
        return {type: SEARCH_PROFILES.SUCCESS, data: {profiles}};
    };

    const failure = err => ({
        type: SEARCH_PROFILES.FAILURE,
        err
    });

    return (dispatch) => {
        dispatch(initial());

        MainAPI.searchProfiles({offset,limit,tags}).then(async ({data}) => {
            let {data : profiles} = data;

            // loop through each profile
            for (let i = 0; i < profiles.length; i++) {
                const {profilePicture} = profiles[i];
                if (!profilePicture) continue;
                const {cropped : croppedId} = profilePicture;

                // if the ID's exits
                if (croppedId) {

                    // fetch images by id
                    let {data: croppedFile} = await MainAPI.getImage(croppedId);

                    // convert buffer to base 64
                    croppedFile = bufferToBase64(croppedFile);

                    // finally, update the profile picture
                    profiles[i].profilePicture = {
                        file: croppedFile,
                        id: croppedId
                    };
                }
            }
            profiles = profiles.filter(profile => !isEmptyProfile(profile));
            dispatch(success({...data, data : profiles}));
            dispatch(setPreloadDone(true));
            successCallback && successCallback();
        }).catch(err => {
            failureCallback && failureCallback();
            dispatch(failure(err));
        });
    }
}

export function searchGifs({type, term, successCallback = () => {}}) {

    const initial = () => ({
        type: SEARCH_GIF.IN_PROGRESS
    });

    const success = gifs => {
        return {
            type: SEARCH_GIF.SUCCESS,
            data: {
                gifs: gifs.map(gif => gif.images.downsized)
            }
        };
    };

    const failure = err => ({
        type: SEARCH_GIF.FAILURE,
        err
    });

    return dispatch => {
        dispatch(initial());
        const promise = term ? MainAPI.gifSearch({term, type}) : MainAPI.gifTrending({type});
        promise.then(async ({data}) => {
            dispatch(success(data));
            successCallback && successCallback();
        }).catch(err => {
            dispatch(failure(err));
        });
    }
}

export function googleGetToken({code = '', authType, successCallback = () => {}}) {

    const initial = () => ({
        type: GOOGLE_GET_TOKEN.IN_PROGRESS
    });

    const success = (googleData) => ({
        type: GOOGLE_GET_TOKEN.SUCCESS,
        data: {googleData}
    });

    const failure = err => ({
        type: GOOGLE_GET_TOKEN.FAILURE,
        err
    });

    return dispatch => {
        if (!code) return dispatch(failure('Missing "code" from request'));
        if (!authType) return dispatch(failure('Missing "auth type" from request'));

        dispatch(initial());
        MainAPI.getAccessTokenFromCode({code, authType, accountType: ACCOUNT_TYPE.GOOGLE}).then(res => {
            dispatch(success(res.data));
            successCallback && successCallback();
        }).catch(res => {
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function googleGetUserInfo(successCallback = () => {}) {

    const initial = () => ({
        type: GOOGLE_GET_USER_INFO.IN_PROGRESS
    });

    const success = googleUserInfo => ({
        type: GOOGLE_GET_USER_INFO.SUCCESS,
        data: {googleUserInfo}
    });

    const failure = err => ({
        type: GOOGLE_GET_USER_INFO.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {googleData} = getState().app;
        if (!googleData || !googleData.access_token) return dispatch(failure("Missing google access token"));

        dispatch(initial());
        MainAPI.getGoogleUserInfo(googleData.access_token).then(res => {
            dispatch(success(res.data));
            successCallback && successCallback();
        }).catch(res => {
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function instagramGetToken({code = '', successCallback = () => {}}) {

    const initial = () => ({
        type: INSTAGRAM_GET_TOKEN.IN_PROGRESS
    });

    const success = (instagramData) => ({
        type: INSTAGRAM_GET_TOKEN.SUCCESS,
        data: {instagramData}
    });

    const failure = err => ({
        type: INSTAGRAM_GET_TOKEN.FAILURE,
        err
    });

    return dispatch => {
        if (!code) return dispatch(failure('Missing "code" from request'));

        dispatch(initial());
        MainAPI.getAccessTokenFromCode({code, accountType: ACCOUNT_TYPE.IG}).then(res => {
            if  (res && res.data) {
                dispatch(success(res.data));
                successCallback && successCallback();
            } else {
                dispatch(failure("No data in the response"));
            }
        }).catch(res => {
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function instagramGetUserInfo(successCallback = () => {}) {

    const initial = () => ({
        type: INSTAGRAM_GET_USER_INFO.IN_PROGRESS
    });

    const success = instagramUserInfo => ({
        type: INSTAGRAM_GET_USER_INFO.SUCCESS,
        data: {instagramUserInfo}
    });

    const failure = err => ({
        type: INSTAGRAM_GET_USER_INFO.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {instagramData} = getState().app;
        if (!instagramData || !instagramData.access_token || !instagramData.user_id) {
            return dispatch(failure("Missing IG user info"));
        }
        const {user_id, access_token} = instagramData;

        dispatch(initial());
        MainAPI.getInstagramUserInfo({user_id, access_token}).then(res => {
            dispatch(success(res.data));
            successCallback && successCallback();
        }).catch(res => {
            dispatch(failure(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}