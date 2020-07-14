import React from 'react';
import {Provider} from "react-redux";
import store from '../redux/store';
import {ROUTES, COOKIE, ACCOUNT_TYPE} from './enums';
import { createMuiTheme } from '@material-ui/core/styles';
import {Route, Redirect} from 'react-router-dom';
import {
    createError,
    searchProfiles,
    searchGifs,
    fetchNewToken,
    setSearch,
    setPreloadDone,
    reroute
} from '../redux/actions/app';
import {debounce} from "lodash";
import {ThemeProvider} from "@material-ui/core/styles";
import {ThemeContext, THEME} from "./theme";

/**
 * @desc A generic dispatch error function
 * so I don't have to import the store everywhere.
 */
function dispatchError(err) {
    store.dispatch(createError(err));
}

/**
 * @desc For authenticated routes, only show
 * children if the user is logged in. Else,
 * redirect to register page.
 */
function PrivateRoute({children,...props}) {
    const render = ({location}) => {
        const loggedIn = getCookie(COOKIE.LOGGED_IN) === "true";
        if (loggedIn) return children;
        return (
            <Redirect to={{pathname: ROUTES.REGISTER, state: {from: location}}}/>
        );
    };

    return (
        <Route {...props} render={render}/>
    );
}

/**
 * @desc A wrapper for public routes. If a user is logged
 * in, display an Error Page, else display props.children.
 */
function PublicRoute({children, ...props}) {
    const render = ({location}) => {
        const notLoggedIn = getCookie(COOKIE.LOGGED_IN) !== "true";
        if (notLoggedIn) return children;
        return (
            <Redirect to={{pathname: ROUTES.FIND_PEOPLE, state: {from: location}}}/>
        );
    };

    return (
        <Route {...props} render={render}/>
    );
}

/**
 * @param name {string}
 * @desc A utility function for getting a cookie by key.
 */
function getCookie(name) {
    if (typeof window !== "undefined") {
        const cookies = document.cookie.split(";");
        for(const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (name === key.trim()) {
                return decodeURIComponent(value);
            }
        }
    }
    return '';
}

function sentenceCase(str) {
    if (str && str.length) {
        return str.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
    }
    return '';
}

function isEmptyProfile({catchphrase, name, aboutMe, theme, profilePicture, tags, gifs}) {
    if (!catchphrase || !catchphrase.quote || !catchphrase.font) return true;
    if (!name || !name.first || !name.last) return true;
    if (!aboutMe) return true;
    if (!tags || !tags.length) return true;
    if (!gifs || !gifs.length) return true;
    if (!profilePicture) return true;
    return (!theme || !theme.name || !theme.mode || !theme.color || !theme.style);
}

function bufferToBase64(buffer) {
    return "data:image/png;base64," + Buffer.from(buffer, 'binary').toString('base64');
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const profileSearch = ({tags = '', successCallback = () => {}}) => {
    const {dispatch} = store;
    const failureCallback = () => {
        dispatch(fetchNewToken({successCallback: () => {
                dispatch(searchProfiles({tags, successCallback}));
        }}));
    };
    dispatch(searchProfiles({tags, successCallback, failureCallback}));
};

const debouncedKeyPress = debounce(value => {
    const {dispatch} = store;
    dispatch(setSearch(value));
    profileSearch({tags: value});
}, 250);

function modulo(int,n) {
    return ((int % n) + n) % n;
}

const debouncedGifSearch = debounce(({term, type}) => {
    store.dispatch(searchGifs({term,type}));
}, 250);

/**
 * @param tag {string}
 * @param searchTerm {string}
 * @return {int}
 * @desc Assigns a score to a tag based on a
 * search key word
 *
 * Priority:
 *  1) Exact word match (case sensitive)
 *  2) Exact worth math (case insensitive)
 *  3) sub-word match (case sensitive)
 *  4) sub-word match (case insensitive)
 *  5) prefix match (case sensitive)
 *  6) prefix match (case insensitive)
 *  7) substring match (case sensitive)
 *  8) substring match (case insensitive)
 */
function tagScore(tag='', searchTerm='') {
    // scores not applied to empty terms
    if (!tag || !searchTerm) return 0;

    // constants
    const tagLowerCase = tag.toLowerCase();
    const searchLowerCase = searchTerm.toLowerCase();
    const words = subWords(tag);
    const wordsLowerCase = subWords(tagLowerCase);

    // exact word
    if (tag === searchTerm) return 20;
    if (tagLowerCase === searchLowerCase) return 19;

    // sub word
    if (words.includes(searchTerm)) return 10;
    if (wordsLowerCase.includes(searchLowerCase)) return 9;

    // prefix
    if (words.some(target => prefixMatch(target, searchTerm))) return 5;
    if (wordsLowerCase.some(target => prefixMatch(target, searchLowerCase))) return 4;

    // substring
    if (words.some(target => substringMatch(target, searchTerm))) {
        return 1;
    }
    if (wordsLowerCase.some(target => substringMatch(target, searchLowerCase))) {
        return .25;
    }

    // not relevant
    return 0;
}

/**
 * @param tags {string[]}
 * @param searchTerms {string}
 * @desc Assigns an average tag score to a list of tags.
 */
function averageTagsScore(tags = [], searchTerms ='') {
    const scores = subWords(searchTerms).map(
        searchTerm => tags.map(tag => tagScore(tag, searchTerm))
    ).reduce((a,b) => a.concat(b), []);
    return scores.filter(score => score > 0).reduce((a,b) => a + b, 0);
}

function subWords(tag) {
    return tag.split(new RegExp('\\W'))
}
function prefixMatch(target, searchTerm) {
   return target.slice(0,searchTerm.length) === searchTerm;
}

function substringMatch(target, searchTerm) {
    return target.includes(searchTerm);
}

function AppProvider({children}) {
    const currentTheme = THEME.LIGHT;
    const MATERIAL_UI_THEME = createMuiTheme({
        palette: {
            primary: currentTheme.primary,
            secondary: currentTheme.secondary
        }
    });

    return (
        <Provider store={store}>
            <ThemeProvider theme={MATERIAL_UI_THEME}>
                <ThemeContext.Provider value={currentTheme}>
                    {children}
                </ThemeContext.Provider>
            </ThemeProvider>
        </Provider>
    );
}

function setUpUserInfo({getState, email, password, type, failure, dispatch}) {
    if (type === ACCOUNT_TYPE.GOOGLE) {
        const {googleUserInfo} = getState().app;
        if (!googleUserInfo || !googleUserInfo.email || !googleUserInfo.id) {
            return dispatch(failure("Missing Google User Info from request"));
        }
        return [googleUserInfo.email, googleUserInfo.id];
    }
    return [email,password];
}

export {
    dispatchError,
    PrivateRoute,
    PublicRoute,
    getCookie,
    sentenceCase,
    isEmptyProfile,
    bufferToBase64,
    fileToBase64,
    profileSearch,
    debouncedGifSearch,
    debouncedKeyPress,
    modulo,
    averageTagsScore,
    setUpUserInfo,
    AppProvider
};
