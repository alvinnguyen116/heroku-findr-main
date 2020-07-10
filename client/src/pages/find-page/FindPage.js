import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ProfileButton from "./profile-button/profile-button";
import Card from "@material-ui/core/Card";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import {isEmptyProfile, averageTagsScore, debouncedProfileSearch, getCookie} from "../../utils";
import {COOKIE, ROUTES} from '../../utils/enums';
import {reroute, keyDown, keyUp, setIndex, setPreloadDone} from "../../redux/actions/app";
import {INITIAL_STATE} from "../../redux/reducers/profile";
import Profile from "../../components/profile/profile";
import './find-page.scss';


/**
 * @param appState
 * @param profileState
 * @param dispatch
 * @desc The main page a user sees.
 * Displays a random list of users and allow
 * users to be searched by tags.
 *
 */
function FindPage({appState, profileState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {data} = appState.profiles;
    const {searchTag, currentIndex, preloadDone, inProgress} = appState;
    const sortedProfiles = data.map(profile => {
        const score = averageTagsScore(profile.tags, searchTag);
        return {...profile, score};
    }).sort((a,b) => b.score - a.score);
    const loggedIn = getCookie(COOKIE.LOGGED_IN) === "true";
    const profileCompleted = !isEmptyProfile(profileState);

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [menuOpen, setMenuOpen] = useState(true);
    const [resizeActive, setResizeActive] = useState(false);

    // METHODS ---------------------------------------------------------------------------------------------------------

    function keydownListener(e) {
        const {keyCode} = e;
        switch(keyCode) {
            case 37:
                setMenuOpen(false);
                e.preventDefault();
                break;
            case 38:
                dispatch(keyUp());
                e.preventDefault();
                break;
            case 39:
                setMenuOpen(true);
                e.preventDefault();
                break;
            case 40:
                dispatch(keyDown());
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc Whenever the current index changes,
     * scroll the selected element if needed.
     */
    useEffect(() => {
        const selected = document.querySelector('.profile-button.selected');
        selected && selected.scrollIntoViewIfNeeded();
    }, [currentIndex]);

    /**
     * @desc Key board shortcuts
     */
    useEffect(() => {
        document.addEventListener('keydown', keydownListener, true);

        return () => {
            document.removeEventListener('keydown', keydownListener, true);
        };
    }, []);

    let timeoutId;
    useEffect(() => {
        let mounted = true;
        clearTimeout(timeoutId);
        setResizeActive(true);

        timeoutId = setTimeout(() => {
            if (mounted) setResizeActive(false);
        }, 2000);

        return () => {
            mounted = false;
        }
    }, [menuOpen]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderProfileButtons = (showDefault = false) => {
        let profileButtons = [...Array(10).keys()].map(i =>
            <ProfileButton className={menuOpen ? "OPEN" : ""} showDefault={true} key={i}/>
        );
        if (!showDefault) {
            profileButtons = sortedProfiles.map((profile, i) => {
                const {profilePicture, name, tags, _id} = profile;
                const props = {
                    profilePicture, name, tags,
                    onClick: () => dispatch(setIndex(i)),
                    className: `${(i === currentIndex ? 'selected' : '')} ${menuOpen ? "OPEN" : ""}`,
                };
                return (<ProfileButton {...props} key={_id}/>);
            });
        }
        return (
            <div className={"profile-buttons-container hide-scrollbar"}>
                <Card elevation={1} className={"profile-buttons fade-in custom-scrollbar"}>
                    {profileButtons}
                </Card>
                <span className={`menu-button ${resizeActive ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <ArrowBackIosRoundedIcon /> : <ArrowForwardIosRoundedIcon />}
                </span>
            </div>

        );
    };

    if (preloadDone && ((loggedIn && profileCompleted) || !loggedIn) && !inProgress) {
        if (currentIndex < sortedProfiles.length && sortedProfiles[currentIndex]) {
            return (
                <div className={"find-page"}>
                    {renderProfileButtons()}
                    <Profile {...sortedProfiles[currentIndex]} className={`find-profile fade-in menu-${menuOpen ? "open" : "closed"}`}/>
                </div>
            );
        }
        if (searchTag) {
            return (
                <h1 className={"error-title fade-in"}>Could not find a profile with that search phrase.</h1>
            );
        }
    }
    return (
        <div className={"find-page default"}>
            {renderProfileButtons(true)}
            <Profile {...INITIAL_STATE} className={`find-profile fade-in menu-${menuOpen ? "open" : "closed"}`}/>
        </div>
    );
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(FindPage);