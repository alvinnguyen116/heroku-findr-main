import {
    GET_MY_PROFILE,
    PROFILE_UPDATE,
    UPDATE_PROFILE_PICTURE,
    GET_PROFILE_PICTURE,
    PROFILE,
} from "./actionTypes";
import {bufferToBase64, fileToBase64} from "../../utils";
import {MainAPI} from "../../api/api";
import {createError} from "./app";

export function emptyProfile() {
    return {type: PROFILE.EMPTY};
}

export function propertyUpdate({property, value}) {
    return {
        type: PROFILE.PROPERTY_UPDATE,
        property,
        value
    }
}

export function getProfile(successCallback) {

    const initialGetProfile = () => ({
        type: GET_MY_PROFILE.IN_PROGRESS
    });

    const successGetProfile = (res) => {
        // Only get specified data from response
        // Don't include user's role!
        const keys = ["catchphrase", "gifs", "name", "tags", "aboutMe", "theme"];
        const data = {};
        for (let key of keys) {
            if (key in res) data[key] = res[key];
        }
        return {type: GET_MY_PROFILE.SUCCESS, data};
    };

    const failureGetProfile = err => ({
        type: GET_MY_PROFILE.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {accessToken} = getState().app;
        if (!accessToken) return dispatch(createError("No access token."));

        dispatch(initialGetProfile());
        MainAPI.getProfile(accessToken).then(({data}) => {
            const localSuccessCB = () => {
                dispatch(successGetProfile(data));
                successCallback && successCallback();
            };

            if (data.profilePicture && data.profilePicture.original && data.profilePicture.cropped) {
                dispatch(getProfilePictures({...data.profilePicture, successCallback: localSuccessCB}));
            } else {
                localSuccessCB();
            }
        }).catch(err => {
            dispatch(failureGetProfile(err));
        });
    }
}

export function getProfilePictures({original: originalId, cropped: croppedId, successCallback}) {

    const initialGetProfilePicture = () => ({
        type: GET_PROFILE_PICTURE.IN_PROGRESS
    });

    const successGetProfilePicture  = ({originalFile, croppedFile}) => {
        const data = {
            profilePicture: {
                original: {
                    file: originalFile,
                    id: originalId
                },
                cropped: {
                    file: croppedFile,
                    id: croppedId
                }
            }
        };
        return {type: GET_PROFILE_PICTURE.SUCCESS, data};
    };

    const failureGetProfilePicture = err => ({
        type: GET_PROFILE_PICTURE.FAILURE,
        err
    });

    return async dispatch => {
        dispatch(initialGetProfilePicture());
        try {
            let {data: originalFile} = await MainAPI.getImage(originalId);
            let {data: croppedFile} = await MainAPI.getImage(croppedId);
            originalFile = bufferToBase64(originalFile);
            croppedFile = bufferToBase64(croppedFile);
            dispatch(successGetProfilePicture({originalFile, croppedFile}));
            successCallback && successCallback();
        } catch (err) {
            dispatch(failureGetProfilePicture(err))
        }
    }
}

export function profileUpdate({catchphrase, gifs, name, tags, aboutMe, theme, successCallback}) {

    const initialProfileUpdate = () => ({
        type: PROFILE_UPDATE.IN_PROGRESS
    });

    const successProfileUpdate = () => ({
        type: PROFILE_UPDATE.SUCCESS,
        data: {catchphrase, gifs, name, tags, aboutMe, theme}
    });

    const failureProfileUpdate = err => ({
        type: PROFILE_UPDATE.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {accessToken : token} = getState().app;
        if (!token) return dispatch(createError("No access token."));

        dispatch(initialProfileUpdate());
        MainAPI.updateProfile({catchphrase, gifs, name, tags, aboutMe, theme, token}).then(() => {
            dispatch(successProfileUpdate());
            successCallback && successCallback();
        }).catch(res => {
            dispatch(failureProfileUpdate(res));
        });
    }
}

export function updateProfilePicture({original, cropped, successCallback, failureCallback}) {

    const initial = () => ({
        type: UPDATE_PROFILE_PICTURE.IN_PROGRESS
    });

    const success = async ({original: originalId, cropped: croppedId}) => ({
        type: UPDATE_PROFILE_PICTURE.SUCCESS,
        data: {
            profilePicture: {
                original: {
                    file: await fileToBase64(original),
                    id: originalId
                },
                cropped: {
                    file: await fileToBase64(cropped),
                    id: croppedId
                }
            }
        }
    });

    const failure = err => ({
        type: UPDATE_PROFILE_PICTURE.FAILURE,
        err
    });

    return  (dispatch, getState) => {
        const {accessToken : token} = getState().app;
        if (!token) return dispatch(createError("No access token."));

        dispatch(initial());
        MainAPI.updateProfilePicture({original, cropped, token}).then(async res => {
            dispatch(await success(res.data));
            successCallback && successCallback();
        }).catch(res => {
            failureCallback && failureCallback();
            dispatch(failure(res));
        });
    }
}

