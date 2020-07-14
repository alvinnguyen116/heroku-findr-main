import {
    GET_MY_PROFILE,
    PROFILE_UPDATE,
    UPDATE_PROFILE_PICTURE,
    GET_PROFILE_PICTURE,
    PROFILE,
} from "./actionTypes";
import {bufferToBase64, fileToBase64} from "../../utils";
import {SNACKBAR_SEVERITY} from '../../utils/enums';
import {MainAPI} from "../../api/api";
import {createError, snackbarMessage} from "./app";

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

/**
 * @desc Updates a subsection of the profile if the value is truthy.
 */
export function profileUpdate({catchphrase, gifs, name, tags, aboutMe, theme, successCallback = () => {},
                              failureCallback = () => {}}) {

    const truthyProps = {};
    if (catchphrase) truthyProps['catchphrase'] = catchphrase;
    if (gifs && gifs.length) truthyProps['gifs'] = gifs;
    if (name && name.first && name.last) truthyProps['name'] = name;
    if (tags && tags.length) truthyProps['tags'] = tags;
    if (aboutMe) truthyProps['aboutMe'] = aboutMe;
    if (theme) truthyProps['theme'] = theme;

    const initialProfileUpdate = () => ({
        type: PROFILE_UPDATE.IN_PROGRESS
    });

    const successProfileUpdate = () => ({
        type: PROFILE_UPDATE.SUCCESS,
        data: truthyProps
    });

    const failureProfileUpdate = err => ({
        type: PROFILE_UPDATE.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {accessToken : token} = getState().app;
        if (!token) return dispatch(createError("No access token."));

        dispatch(initialProfileUpdate());
        MainAPI.updateProfile({...truthyProps, token}).then(() => {
            dispatch(successProfileUpdate());
            dispatch(snackbarMessage({message: 'Profile Update Successful', type: SNACKBAR_SEVERITY.SUCCESS}));
            successCallback && successCallback();
        }).catch(res => {
            failureCallback && failureCallback();
            dispatch(failureProfileUpdate(res));
        });
    }
}

export function updateProfilePicture({original, cropped, successCallback, failureCallback}) {

    const initial = () => ({
        type: UPDATE_PROFILE_PICTURE.IN_PROGRESS
    });

    const success = async ({original: originalId, cropped: croppedId}) => {
        const profilePicture = {};
        if (originalId && original) {
            profilePicture.original = {
                file: await fileToBase64(original),
                id: originalId
            }
        }
        if (croppedId && cropped) {
            profilePicture.cropped = {
                file: await fileToBase64(cropped),
                id: croppedId
            }
        }

        return {
            type: UPDATE_PROFILE_PICTURE.SUCCESS,
            profilePicture
        };
    };

    const failure = err => ({
        type: UPDATE_PROFILE_PICTURE.FAILURE,
        err
    });

    return (dispatch, getState) => {
        const {accessToken : token} = getState().app;
        if (!token) return dispatch(createError("No access token."));

        const data = {}; // only update if property is truthy
        if (original) data['original'] = original;
        if (cropped) data['cropped'] = cropped;
        if (!original && !cropped) return dispatch(failure('Original and Cropped are missing'));

        dispatch(initial());
        MainAPI.updateProfilePicture({...data, token}).then(async res => {
            dispatch(await success(res.data));
            dispatch(snackbarMessage({message: 'Profile Update Successful', type: SNACKBAR_SEVERITY.SUCCESS}));
            successCallback && successCallback();
        }).catch(res => {
            failureCallback && failureCallback();
            dispatch(failure(res));
        });
    }
}

