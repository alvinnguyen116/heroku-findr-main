import React, {useEffect, useState, useRef} from 'react';
import Paper from '@material-ui/core/Paper';
import {useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import Search from '../input/search/search';
import {logout, reroute, setInProgress, setKeyboardShortcuts} from '../../redux/actions/app';
import {COOKIE, ROUTES, APP_NAME} from '../../utils/enums';
import {isEmptyProfile, debouncedKeyPress, dispatchError, getCookie} from "../../utils";
import Icon from '../../assets/icon';
import './header.scss';

/**
 * @desc A navigation menu component.
 * The header is only displayed for users
 * that are logged in.
 * @return {null}
 */
function Header({appState, profileState, dispatch}) {

    //todo: create option to edit profile

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {profilePicture, name} = profileState;
    const {preloadDone, searchTag} = appState;
    const profileCompleted = !isEmptyProfile(profileState);
    const REMOVE_HEADER = [ROUTES.NEXT_STEPS, '/auth/google/login', '/auth/google/register', ROUTES.BLANK];
    const loggedIn = getCookie(COOKIE.LOGGED_IN) === "true";
    const location = useLocation();
    const dontShow = REMOVE_HEADER.includes(location.pathname);
    const isLoginPage = location.pathname === ROUTES.LOGIN;

    // REFERENCES ------------------------------------------------------------------------------------------------------

    const buttonRef = useRef();

    //  COMPONENT STATE ------------------------------------------------------------------------------------------------

    const [croppedURL, setCroppedURL] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [value,setValue] = useState(searchTag);

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        const handler = e => {
            if (buttonRef && buttonRef.current && !buttonRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', handler, false);
        return () => {
            document.removeEventListener('click', handler, false);
        }
    }, []);

    useEffect(() => {
        if (profilePicture.cropped && profilePicture.cropped.file) {
            setCroppedURL(profilePicture.cropped.file);
        }
    }, [profilePicture.cropped]);

    useEffect(() => {
        if (location.pathname === ROUTES.FIND_PEOPLE) {
            dispatch(setInProgress(true));
            try {
                debouncedKeyPress(value);
            } catch (err) {
                dispatchError(err);
            }
        }
    }, [value, location.pathname]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const signOut = () => {
        dispatch(logout());
    };

    const viewProfile = () => {
        dispatch(reroute(ROUTES.MY_PROFILE));
    };

    const aboutPage = () => {
        dispatch(reroute(ROUTES.ABOUT));
    };

    const loginPage = () => {
        dispatch(reroute(ROUTES.LOGIN));
    };

    const registerPage = () => {
        dispatch(reroute(ROUTES.REGISTER));
    };

    const findPage = () => {
        dispatch(reroute(ROUTES.FIND_PEOPLE));
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const searchProps = {
        value, setValue,
        placeholder: 'Search Tags',
        handlers: {
            onKeyPress: e => {
                if (e.key === "Enter") {
                    dispatch(reroute(ROUTES.FIND_PEOPLE));
                }
            }
        }
    };

    const renderRightMostButton = () => {
        if (loggedIn && profileCompleted) {
            return (
                <div
                    className={`main-button button ${showMenu ? 'hover' : ''}`}
                    onClick={() => setShowMenu(!showMenu)}
                    ref={buttonRef}>
                    <img src={croppedURL} alt={'User Profile'} className={"image-icon"}/>
                    <span className={"name"}>{`${name.first} ${name.last[0]}.`}</span>
                    <CSSTransition in={showMenu} timeout={100} mountOnEnter unmountOnExit classNames={"menu"}>
                        <Paper elevation={8} className={"menu-option"}>
                            <div className={"option"} onClick={viewProfile}>
                                <span className={"label primary"}>View Profile</span>
                            </div>
                            <div className={"option"} onClick={signOut}>
                                <span className={"label secondary"}>Sign Out</span>
                            </div>
                        </Paper>
                    </CSSTransition>
                </div>
            );
        }
        return (
            <div className={"login"} onClick={isLoginPage ? registerPage : loginPage}>
                {isLoginPage ? 'Register' : 'Login'}
            </div>
        );
    };

    const renderRight = () => {
        if (loggedIn && !profileCompleted) return null;
        return (
            <>
                <div className={"home"} onClick={aboutPage}>
                    What is {APP_NAME}?
                </div>
                {renderRightMostButton()}
            </>
        );
    };

    if (dontShow) return null;

    const renderContent = () => {
        if (preloadDone) {
            return (
                <>
                    <div className={"left"}>
                        <Icon className={'icon'} onClick={findPage}/>
                        <Search {...searchProps}/>
                    </div>
                    {renderRight()}
                </>
            );
        }
        return null;
    };

    return (
        <div className={"header fade-effect"}>
            <div className={"left"}>
                <Icon className={'icon'} onClick={findPage}/>
                <Search {...searchProps}/>
            </div>
            {renderRight()}
        </div>
    );
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(Header);