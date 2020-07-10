import React, {useState, useContext} from 'react';
import Button from '@material-ui/core/Button';
import Email from '../../components/input/email/Email';
import Password from "../../components/input/password/Password";
import {isValidEmail} from "../../utils/validators";
import {useInput} from "../../utils/hooks";
import {localLogin} from "../../redux/actions/app";
import {ThemeContext} from '../../utils/theme';
import GoogleAuth from '../../components/input/google/Google';
import LinkInstagram from "../../components/input/instagram/Instagram";
import {AUTH_TYPE} from "../../utils/enums";
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
        dispatch(localLogin({email, password})); // 1) login and get tokens
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

    return (
        <div className={'login-page fade-in'}>
            <Paper elevation={3} className={"local"}>
                <form>
                    <Email className={"text-field"} error={emailError} onChange={onChangeEmail} email={email}/>
                    <Password className={"text-field"} onChange={e => setPassword(e.currentTarget.value)} password={password}/>
                    <div className={"link-and-button"}>
                        <Button {...buttonProps}>
                            Login
                        </Button>
                    </div>
                </form>
                <GoogleAuth type={AUTH_TYPE.LOGIN} className={"google"}/>
            </Paper>
        </div>
    );
}

export default LoginPage;