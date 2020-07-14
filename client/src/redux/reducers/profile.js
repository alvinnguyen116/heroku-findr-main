import {GET_MY_PROFILE, UPDATE_PROFILE_PICTURE, PROFILE_UPDATE, GET_PROFILE_PICTURE, PROFILE} from '../actions/actionTypes';

const emptyProfile = {
    catchphrase: {
        quote: '',
        font: ''
    },
    name: {
        first: '',
        last: ''
    },
    profilePicture: {
        original: {
            file: null,
            id: ''
        },
        cropped: {
            file: null,
            id: ''
        }
    },
    aboutMe: '',
    gifs: [],
    tags: [],
    theme: {
        mode: '',
        color: '',
        style: '',
        name: ''
    }
};

export const INITIAL_STATE = {
    inProgress: false,
    err: null,
    ...emptyProfile
};

export default (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFILE_UPDATE.IN_PROGRESS:
        case UPDATE_PROFILE_PICTURE.IN_PROGRESS:
        case GET_MY_PROFILE.IN_PROGRESS:
        case GET_PROFILE_PICTURE.IN_PROGRESS:
            return {
                ...prevState,
                err: null,
                inProgress: true
            };
        case PROFILE_UPDATE.SUCCESS:
        case GET_MY_PROFILE.SUCCESS:
        case GET_PROFILE_PICTURE.SUCCESS:
            return {
                ...prevState,
                inProgress: false,
               ...action.data
            };
        case UPDATE_PROFILE_PICTURE.SUCCESS:
            return {
                ...prevState,
                inProgress: false,
                profilePicture: {
                    ...prevState.profilePicture, // include previous state in update
                    ...action.profilePicture // overrides previous state if exists
                }
            };
        case PROFILE.EMPTY:
            return INITIAL_STATE;
        case PROFILE.PROPERTY_UPDATE:
            return {
                ...prevState,
                [action.property] : action.value
            };
        case PROFILE_UPDATE.FAILURE:
        case UPDATE_PROFILE_PICTURE.FAILURE:
        case GET_MY_PROFILE.FAILURE:
        case GET_PROFILE_PICTURE.FAILURE:
            return {
                ...prevState,
                inProgress: false,
                err: action.err
            };
        default:
            return prevState;
        }
}