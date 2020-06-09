import React, {useEffect, useState, useRef} from 'react';
import Paper from '@material-ui/core/Paper';
import {useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import Search from '../input/search/search';
import {logout, reroute, setPreloadDone} from '../../redux/actions/app';
import {emptyProfile} from "../../redux/actions/profile";
import {ROUTES} from '../../utils/enums';
import {isEmptyProfile, debouncedKeyPress} from "../../utils";
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
    const {searchTag, preloadDone} = appState;
    const profileCompleted = !isEmptyProfile(profileState);
    const HEADER_ROUTES = [ROUTES.FIND_PEOPLE, ROUTES.MY_PROFILE];
    const IGNORE_KEYS = [37, 38, 39, 40];
    const location = useLocation();
    const showHeader = HEADER_ROUTES.includes(location.pathname);

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

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const signOut = () => {
        const successCallback = () => dispatch(emptyProfile()); // 2) logs out client side
        dispatch(logout(successCallback)); // 1) logs out server side
    };

    const viewProfile = () => {
        dispatch(reroute(ROUTES.MY_PROFILE));
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    if (showHeader)  {
        const searchProps = {
            value,setValue,
            placeholder: 'Search Tags',
            handlers: {
                onKeyUp: e => {
                    if (IGNORE_KEYS.includes(e.keyCode)) return;
                    dispatch(setPreloadDone(false));
                    debouncedKeyPress(e.target.value);
                }
            }
        };
        if (preloadDone && profileCompleted) {
            return (
                <div className={"header fade-effect"}>
                    <Search {...searchProps}/>
                    <div
                        className={`main-button ${showMenu ? 'hover' : ''}`}
                        onClick={() => setShowMenu(!showMenu)}
                        ref={buttonRef}>
                        <img src={croppedURL} alt={'User Profile'} className={"image-icon"}/>
                        <span className={"name"}>{name.first}</span>
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
                </div>
            );
        }

       return (
           <div className={"header fade-effect default"}>
               <Search {...searchProps}/>
               <div className={`main-button loading-bg`}>
                   <div className={"image-icon"}/>
                   <span className={"name default"}/>
               </div>
           </div>
       );
    }
    return null;
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(Header);