import React, {useEffect, useState, useRef} from 'react';
import Paper from '@material-ui/core/Paper';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import {useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import Search from '../input/search/search';
import {logout, reroute, setPreloadDone} from '../../redux/actions/app';
import {emptyProfile} from "../../redux/actions/profile";
import {COOKIE, ROUTES} from '../../utils/enums';
import {isEmptyProfile, debouncedKeyPress, dispatchError, getCookie} from "../../utils";
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
    const {accessToken, searchTag} = appState;
    const profileCompleted = !isEmptyProfile(profileState);
    const loggedIn = getCookie(COOKIE.LOGGED_IN) === "true" && accessToken;

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
        dispatch(setPreloadDone(false));
        try {
            debouncedKeyPress(value);
        } catch (err) {
            dispatchError(err);
        }
    }, [value]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const signOut = () => {
        const successCallback = () => dispatch(emptyProfile()); // 2) logs out client side
        dispatch(logout(successCallback)); // 1) logs out server side
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
            <div className={"main-button button"} onClick={loginPage}>
                Login
            </div>
        );
    };

    return (
        <div className={"header fade-effect"}>
            <Search {...searchProps}/>
            <div className={"right"}>
                <div className={'link about button'} onClick={aboutPage}>
                    <HomeOutlinedIcon/>
                </div>
                <div className={"spacer"}/>
                {renderRightMostButton()}
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(Header);