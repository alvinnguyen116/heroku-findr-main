import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Switch, useHistory, Route} from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import FindPage from "../../pages/find-page/FindPage";
import LoginPage from "../../pages/login-page/login-page";
import NextStepsPage from "../../pages/next-steps-page/NextStepsPage";
import RegisterPage from "../../pages/register-page/RegisterPage";
import ProfilePage from "../../pages/profile-page/profile-page";
import AuthPage from "../../pages/auth-page/AuthPage";
import AboutPage from "../../pages/about-page/AboutPage";
import {fetchNewToken, setBackdrop, reroute, setPreloadDone} from "../../redux/actions/app";
import {ROUTES, SNACKBAR_SEVERITY, COOKIE, ACCOUNT_TYPE} from '../../utils/enums';
import {PrivateRoute, getCookie, isEmptyProfile} from "../../utils";
import {getProfile} from "../../redux/actions/profile";
import Header from "../header/Header";
import './App.scss';

/**
 * @param dispatch {Function}
 * @param appState {Object}
 * @desc The top level app component.
 *
 * Main Responsibilities:
 *  - switch pages based on route
 *  - act as Theme provider
 *  - open snackbar if necessary
 *  - open backdrop if necessary
 */
function App({appState, profileState, dispatch}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [componentDidMount, setComponentDidMount] = useState(false);
    const history = useHistory();

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {snackbar, route, accessToken, backdropElement, preloadDone} = appState;
    const profileCompleted = !isEmptyProfile(profileState);
    const loggedIn = getCookie(COOKIE.LOGGED_IN) === "true";

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc If the user is logged in and there is
     * currently no access token, get a new token.
     */
    useEffect(() => {
        setComponentDidMount(true);
        const done = () => dispatch(setPreloadDone(true));
        if (loggedIn && !accessToken) {
            const successCallback = () => dispatch(getProfile(done));
            dispatch(fetchNewToken({successCallback, failureCallback: done}));
        } else {
            done();
        }
    }, []);

    useEffect(() => {
        if (accessToken && preloadDone && !profileCompleted) {
            dispatch(reroute(ROUTES.NEXT_STEPS));
        }
    }, [accessToken, preloadDone]);
    /**
     * @desc If there is a snackbar message,
     * display it.
     */
    useEffect(() => {
        snackbar && snackbar.message && setSnackbarOpen(true);
    }, [snackbar]);

    /**
     * @desc If the route changes, programmatically
     * push route to history.
     */
    useEffect(() => {
        route && history.push(route);
    }, [route]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const handleClose = () => setSnackbarOpen(false);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const snackbarProps = {
        anchorOrigin: {
            vertical: "top",
            horizontal: "center"
        },
        open: snackbarOpen,
        autoHideDuration: snackbar.type === SNACKBAR_SEVERITY.SUCCESS ? 1000 : 3000,
        onClose: handleClose
    };

    const renderBackdropElement = () => {
        /**
         * @desc Close the backdrop on click,
         * but do not close if click is on backdrop's
         * children.
         */
        const onClick = e => {
            if (e.currentTarget === e.target) {
                dispatch(setBackdrop(null));
            }
        };

        if (backdropElement) {
            return (
                <div className={"backdrop"} onClick={onClick}>
                    {backdropElement}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="App" style={{visibility: componentDidMount ? 'visible' : 'hidden'}}>
                <main>
                    <Header/>
                    <Switch>
                        <PrivateRoute path={ROUTES.MY_PROFILE}>
                            <ProfilePage/>
                        </PrivateRoute>
                        <PrivateRoute path={ROUTES.NEXT_STEPS}>
                            <NextStepsPage/>
                        </PrivateRoute>
                        <Route path={ROUTES.ABOUT}>
                            <AboutPage/>
                        </Route>
                        <Route path={ROUTES.LOGIN}>
                            <LoginPage dispatch={dispatch}/>
                        </Route>
                        <Route path={ROUTES.REGISTER}>
                            <RegisterPage/>
                        </Route>
                        <Route path={ROUTES.GOOGLE_AUTH}>
                            <AuthPage type={ACCOUNT_TYPE.GOOGLE}/>
                        </Route>
                        <Route path={ROUTES.INSTAGRAM_AUTH}>
                            <AuthPage type={ACCOUNT_TYPE.IG}/>
                        </Route>
                        <Route path={ROUTES.FIND_PEOPLE}>
                            <FindPage/>
                        </Route>
                    </Switch>
                </main>
            </div>
            <Snackbar {...snackbarProps}>
                <MuiAlert elevation={6} variant="filled"  onClose={handleClose} severity={snackbar.type}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
            {renderBackdropElement()}
        </>
    );
}

const mapStateToProps = state => ({
    appState: state.app,
    profileState: state.profile
});

export default connect(mapStateToProps)(App);
