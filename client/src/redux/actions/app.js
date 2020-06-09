import {APP, LOCAL_LOGIN, REGISTER, TOKEN_FETCH, LOGOUT, SEARCH_PROFILES, SEARCH_GIF} from './actionTypes';
import {AuthAPI, MainAPI} from "../../api/api";
import {ROUTES, SNACKBAR_SEVERITY} from '../../utils/enums';
import {bufferToBase64, isEmptyProfile} from "../../utils";

export function createError(err) {
    return {
        type: APP.SET_ERROR,
        data: {err}
    };
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

export function setSearch(searchTag) {
    return {
        type: APP.SET_SEARCH,
        data: {searchTag, currentIndex: 0}
    }
}

export function keyUp() {
    return {
        type: APP.KEY_UP
    };
}

export function keyDown() {
    return {
        type: APP.KEY_DOWN
    };
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

export function localLogin({email, password, successCallback}) {

    const initialLogin = () => ({
        type: LOCAL_LOGIN.IN_PROGRESS
    });

    const successLogin = ({accessToken}) => ({
       type: LOCAL_LOGIN.SUCCESS,
       data: {accessToken}
    });

    const failureLogin = err => ({
       type: LOCAL_LOGIN.FAILURE,
       err
    });

    return dispatch => {
        dispatch(initialLogin());
        AuthAPI.login({email, password}).then(res => {
            dispatch(successLogin(res.data));
            successCallback && successCallback();
        }).catch(res => {
            dispatch(failureLogin(res.response.data.err));
            dispatch(snackbarMessage({message: res.response.data.err, type: SNACKBAR_SEVERITY.ERROR}));
        });
    }
}

export function register({email, password}) {

    const initialRegister = () => ({
        type: REGISTER.IN_PROGRESS
    });

    const successRegister = ({accessToken}) => ({
        type: REGISTER.SUCCESS,
        data: {accessToken}
    });

    const failureRegister = err => ({
        type: REGISTER.FAILURE,
        err
    });

    return dispatch => {
        dispatch(initialRegister());
        AuthAPI.register({email, password}).then(({data}) => {
            dispatch(reroute(ROUTES.NEXT_STEPS));
            dispatch(successRegister(data));
            dispatch(setPreloadDone(true));
        }).catch(res => {
            dispatch(failureRegister(res.response.data.err));
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
        AuthAPI.logout().then(() => {
            dispatch(successLogout());
            successCallback && successCallback();
            dispatch(reroute(ROUTES.REGISTER));
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

    return (dispatch, getState) => {
        dispatch(initial());
        const {accessToken : token} = getState().app;
        if (!token) return dispatch(createError("No access token."));

        MainAPI.searchProfiles({offset,limit,tags,token}).then(async ({data}) => {
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

export function searchGifs({type, term, successCallback}) {

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

