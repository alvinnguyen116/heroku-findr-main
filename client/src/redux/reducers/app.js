import {
    APP, LOCAL_LOGIN, REGISTER,
    TOKEN_FETCH, LOGOUT, SEARCH_PROFILES,
    SEARCH_GIF, GOOGLE_GET_TOKEN,
    GOOGLE_GET_USER_INFO, INSTAGRAM_GET_TOKEN
} from '../actions/actionTypes';

import {modulo} from "../../utils";

const INITIAL_STATE = {
    inProgress: false,
    err: null,
    accessToken: '',
    googleData: {},
    instagramData: {},
    googleUserInfo: {},
    route: '',
    snackbar: {
        message: '',
        type: ''
    },
    backdropElement: null,
    profiles: {
        total: 0,
        limit: 0,
        offset: 0,
        data: []
    },
    preloadDone: false,
    profileCompleted: false,
    currentIndex: 0,
    searchTag: '',
    startSearch: false,
    gifs: []
};

export default (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOCAL_LOGIN.IN_PROGRESS:
        case REGISTER.IN_PROGRESS:
        case TOKEN_FETCH.IN_PROGRESS:
        case LOGOUT.IN_PROGRESS:
        case SEARCH_PROFILES.IN_PROGRESS:
        case SEARCH_GIF.IN_PROGRESS:
        case GOOGLE_GET_TOKEN.IN_PROGRESS:
        case GOOGLE_GET_USER_INFO.IN_PROGRESS:
        case INSTAGRAM_GET_TOKEN.IN_PROGRESS:
            return {
                ...prevState,
                err: null,
                inProgress: true
            };
        case APP.SET_ERROR:
        case APP.SNACKBAR_MESSAGE:
        case APP.REROUTE:
        case APP.OPEN_BACKDROP:
        case APP.SET_SEARCH:
        case APP.SET_PRELOAD_DONE:
        case APP.SET_START_SEARCH:
        case APP.SET_IN_PROGRESS:
            return {
                ...prevState,
                ...action.data
            };
        case LOCAL_LOGIN.SUCCESS:
        case TOKEN_FETCH.SUCCESS:
        case REGISTER.SUCCESS:
        case SEARCH_PROFILES.SUCCESS:
        case SEARCH_GIF.SUCCESS:
        case APP.CURRENT_INDEX:
        case GOOGLE_GET_TOKEN.SUCCESS:
        case GOOGLE_GET_USER_INFO.SUCCESS:
        case INSTAGRAM_GET_TOKEN.SUCCESS:
            return {
                ...prevState,
                inProgress: false,
                ...action.data
            };
        case LOGOUT.SUCCESS:
            return {
                ...prevState,
                inProgress: false,
                accessToken: '',
                googleData: {},
                googleUserInfo: {}
            };
        case APP.KEY_DOWN:
            return {
                ...prevState,
                currentIndex: modulo(prevState.currentIndex + 1, prevState.profiles.data.length || 1)
            };
        case APP.KEY_UP:
            return {
                ...prevState,
                currentIndex: modulo(prevState.currentIndex - 1, prevState.profiles.data.length || 1)
            };
        case LOCAL_LOGIN.FAILURE:
        case REGISTER.FAILURE:
        case TOKEN_FETCH.FAILURE:
        case LOGOUT.FAILURE:
        case SEARCH_PROFILES.FAILURE:
        case SEARCH_GIF.FAILURE:
        case GOOGLE_GET_TOKEN.FAILURE:
        case GOOGLE_GET_USER_INFO.FAILURE:
        case INSTAGRAM_GET_TOKEN.FAILURE:
            return {
                ...prevState,
                inProgress: false,
                err: action.err
            };
        default:
            return prevState;
    }
}