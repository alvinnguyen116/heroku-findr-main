import React from 'react';
import {connect} from 'react-redux';
import Profile from "../../components/profile/profile";
import './profile-page.scss';

function ProfilePage({profileState, appState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

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

    if (preloadDone) {
        return (
            <div className={"profile-page"}>
                <Profile {...profileProps} />
            </div>
        );
    }

    return null;
}

const mapStateToProps = state => ({
   profileState: state.profile,
   appState: state.app
});

export default connect(mapStateToProps)(ProfilePage);