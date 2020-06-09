import React from 'react';
import {connect} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import './error-page.scss';

/**
 * @param message {string}
 * @desc A page for displaying an error.
 */
function ErrorPage({appState, message}) {

    // CONSTANTS

    const {preloadDone} = appState;

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    /**
     * @desc Only show a message when an API call
     * is not in progress.
     */
    const renderMessage = () => {
        if (preloadDone) {
           return (<h1 className={"fade-in"}>{JSON.stringify(message)}</h1>);
        }
        return (<CircularProgress color="primary" className={"spinner"}/>);
    };

    return (
        <div className={"error-page error-title "}>
            {renderMessage()}
        </div>
    );
}

const mapStateToProps = state => ({
   appState: state.app,
   profileState: state.profile
});

export default connect(mapStateToProps)(ErrorPage);