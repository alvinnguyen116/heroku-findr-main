import React, {useState, useContext} from 'react';
import Button from '@material-ui/core/Button';
import Email from '../../components/input/email/Email';
import Password from "../../components/input/Password";
import {isValidEmail} from "../../utils/validators";
import {useInput} from "../../utils/hooks";
import {localLogin, reroute, setPreloadDone} from "../../redux/actions/app";
import {getProfile} from "../../redux/actions/profile";
import {ROUTES} from '../../utils/enums';
import {ThemeContext} from '../../utils/theme';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import './login-page.scss';

/**
 * @param dispatch {function}
 * @desc A page for logging in.
 */
function LoginPage({dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const Theme = useContext(ThemeContext);

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [password, setPassword] = useState('');
    const [email, emailError, onChangeEmail] = useInput(isValidEmail);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @desc Attempt to login locally. On success,
     * re-route to the Find People Page.
     */
    const onClick = e => {
        e.preventDefault();
        const successCallback = () => {
            dispatch(reroute(ROUTES.FIND_PEOPLE)); // 2) reroute
            dispatch(getProfile(() => { // 3) get profile information
                dispatch(setPreloadDone(true));
            }));
        };
        dispatch(localLogin({email, password, successCallback})); // 1) login and get tokens
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const buttonProps = {
        className: "button",
        variant: "contained",
        color: "secondary",
        type: "submit",
        disabled: emailError || !email || !password,
        onClick
    };

    const linkStyle = {
        color: Theme.primary.A700
    };

    return (
        <Paper elevation={3} className={'login-page fade-in'}>
            <h1 className={"welcome-title"}>Login to My <b>Findr</b></h1>
            <form>
                <Email className={"text-field"} error={emailError} onChange={onChangeEmail}/>
                <Password className={"text-field"} onChange={e => setPassword(e.currentTarget.value)}/>
                <div className={"link-and-button"}>
                    <span className={"register-redirect"}>
                        <Link to={ROUTES.REGISTER} className={"link"} style={linkStyle}>Create an account</Link>
                    </span>
                    <Button {...buttonProps}>
                        Login
                    </Button>
                </div>
            </form>
        </Paper>
    );
}

export default LoginPage;