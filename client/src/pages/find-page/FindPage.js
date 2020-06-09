import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ProfileButton from "./profile-button/profile-button";
import Card from "@material-ui/core/Card";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import {isEmptyProfile, averageTagsScore, debouncedProfileSearch} from "../../utils";
import {ROUTES} from '../../utils/enums';
import {reroute, keyDown, keyUp, setIndex, setStartSearch, setPreloadDone} from "../../redux/actions/app";
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
 * Only logged in users can see this private page.
 */
function FindPage({appState, profileState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {data} = appState.profiles;
    const {searchTag, currentIndex, preloadDone} = appState;
    const sortedProfiles = data.map(profile => {
        const score = averageTagsScore(profile.tags, searchTag);
        return {...profile, score};
    }).sort((a,b) => b.score - a.score);
    const profileCompleted = !isEmptyProfile(profileState);
    const MENU_STYLE = Object.freeze({
        OPEN: {
            container: {width: 275},
            description: {opacity: 1}
        },
        CLOSED: {
            container: {width: 66},
            description: {opacity: 0}
        }
    });

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [menuOpen, setMenuOpen] = useState(true);
    const [buttonStyle, setButtonStyle] = useState(MENU_STYLE.OPEN);

    // METHODS ---------------------------------------------------------------------------------------------------------

    function keydownListener(e) {
        const {keyCode} = e;
        switch(keyCode) {
            case 38:
                dispatch(keyUp());
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
     * @desc If the profile is empty, redirect the user
     * to the next steps page.
     */
    useEffect(() => {
        if (preloadDone) {
            if (!profileCompleted) {
                dispatch(reroute(ROUTES.NEXT_STEPS));
            } else if (!searchTag && (data && !data.length)) {
                dispatch(setPreloadDone(false));
                debouncedProfileSearch({});
            }
        }
    }, [preloadDone, profileCompleted]);

    useEffect(() => {
        if (menuOpen) {
            setButtonStyle(MENU_STYLE.OPEN);
        } else {
            setButtonStyle(MENU_STYLE.CLOSED);
        }
    }, [menuOpen]);

    /**
     * @desc Key board shortcuts
     */
    useEffect(() => {
        document.addEventListener('keydown', keydownListener, true);

        return () => {
            document.removeEventListener('keydown', keydownListener, true);
        };
    }, []);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderProfileButtons = (showDefault = false) => {
        let props = {
            style: buttonStyle
        };
        let profileButtons = [...Array(10).keys()].map(i =>
            <ProfileButton {...props} showDefault={true} key={i}/>
        );
        if (!showDefault) {
            profileButtons = sortedProfiles.map((profile, i) => {
                const {profilePicture, name, tags, _id} = profile;
                props = {
                    ...props,
                    profilePicture, name, tags,
                    onClick: () => dispatch(setIndex(i)),
                    className: i === currentIndex ? 'selected' : '',
                };
                if (!menuOpen) {
                    delete props.name;
                    delete props.tags;
                }
                return (<ProfileButton {...props} key={_id}/>);
            });
        }
        return (
            <div className={"profile-buttons-container hide-scrollbar"}>
                <Card elevation={1} className={"profile-buttons fade-in hide-scrollbar"}>
                    {profileButtons}
                </Card>
                <span className={"menu-button"} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <ArrowBackIosRoundedIcon /> : <ArrowForwardIosRoundedIcon />}
                </span>
            </div>

        );
    };

    if (profileCompleted && preloadDone) {
        if (currentIndex < sortedProfiles.length && sortedProfiles[currentIndex]) {
            return (
                <div className={"find-page"}>
                    {renderProfileButtons()}
                    <Profile {...sortedProfiles[currentIndex]} className={"find-profile fade-in"}/>
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
            <Profile {...INITIAL_STATE} className={"find-profile fade-in"}/>
        </div>
    );
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(FindPage);