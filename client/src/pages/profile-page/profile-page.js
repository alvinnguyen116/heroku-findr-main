import React from 'react';
import {connect} from 'react-redux';
import Profile from "../../components/profile/profile";
import CircularProgress from "@material-ui/core/CircularProgress";
import './profile-page.scss';
import {isEmptyProfile} from "../../utils";

function ProfilePage({profileState, appState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const profileCompleted = !isEmptyProfile(profileState);
    const {preloadDone} = appState;

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const profileProps = {
        className: 'profile-component fade-in',
        ...profileState,
        profilePicture: {
            file: profileState.profilePicture.cropped.file
        },
        edit: true
    };


    if (profileCompleted && preloadDone) {
        return (
            <div className={"profile-page"}>
                <Profile {...profileProps} />
            </div>
        );
    }
    return (<CircularProgress color={"primary"}/>);
}

const mapStateToProps = state => ({
   profileState: state.profile,
   appState: state.app
});

export default connect(mapStateToProps)(ProfilePage);