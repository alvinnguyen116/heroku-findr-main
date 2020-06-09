import React, {useContext, useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import {ThemeContext} from "../../utils/theme";
import Email from '../../components/input/email/Email';
import Password from "../../components/input/Password";
import Button from "@material-ui/core/Button";
import {register} from "../../redux/actions/app";
import {isValidEmail} from "../../utils/validators";
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import {useInput} from "../../utils/hooks";
import './register-page.scss';
import {Link} from "react-router-dom";
import {ROUTES} from "../../utils/enums";
import store from '../../redux/store';

/**
 * @desc A page for registering a new user.
 *
 * Features:
 *  - Only allow new emails
 *  - Only allow strict passwords
 */
function RegisterPage() {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [email, emailError, onChangeEmail] = useInput(isValidEmail);
    const [password, setPassword] = useState('');

    // Password Validations
    const [passCharLimit, setPassCharLimit] = useState(false);
    const [passNumber, setPassNumber] = useState(false);
    const [passUpper, setPassUpper] = useState(false);
    const [passSpecial, setPassSpecial] = useState(false);


    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const Theme = useContext(ThemeContext);
    const {dispatch} = store;
    const passwordError = !password || !passCharLimit || !passNumber || !passUpper || !passSpecial;
    const disableSubmit = emailError || passwordError;

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------
    /**
     * @desc Every time the password changes, update the
     * password validations.
     */
    useEffect(() => {
        const numberRegex = new RegExp(".*\\d.*");
        const specialRegex = new RegExp(".*[!@#%&].*");
        const upperRegex = new RegExp(".*[A-Z].*");

        if (password.length < 8) {
            setPassCharLimit(false)
        } else {
            setPassCharLimit(true);
        }

        if (numberRegex.test(password)) {
            setPassNumber(true);
        } else {
            setPassNumber(false);
        }

        if (specialRegex.test(password)) {
            setPassSpecial(true);
        } else {
            setPassSpecial(false);
        }

        if (upperRegex.test(password)) {
            setPassUpper(true);
        } else {
            setPassUpper(false);
        }
    }, [password]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const onClick = e => {
        e.preventDefault();
        dispatch(register({email, password}));
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderPasswordValidations = () => {
        function renderIcon(pass) {
            return (pass ? <DoneRoundedIcon className={"done"}/> : <ClearRoundedIcon className={"cancel"}/>);
        }
        return (
            <div className={"validations"}>
                <ul>
                    <li>
                        {renderIcon(passCharLimit)}
                        <span>Must be at least 8 characters</span>
                    </li>
                    <li>
                        {renderIcon(passNumber)}
                        <span>Must contain a number</span>
                    </li>
                    <li>
                        {renderIcon(passUpper)}
                        <span>Must contain a capital letter</span>
                    </li>
                    <li>
                        {renderIcon(passSpecial)}
                        <span>Must contain one: ! @ # % &</span>
                    </li>
                </ul>
            </div>
        );
    };

    const pw1Props = {
        onChange: e => setPassword(e.target.value)};

    const buttonProps = {
        className: "button",
        variant: "contained",
        color: "secondary",
        type: "submit",
        disabled: disableSubmit,
        onClick
    };

    const linkStyle = {color: Theme.primary.A700};

    return (
        <Paper elevation={3}  className={"register-page fade-in"}>
            <h1 className={"welcome-title"}>Create a New <b>Findr</b></h1>
            <form>
                <Email error={emailError} onChange={onChangeEmail}/>
                <Password {...pw1Props}/>
                {renderPasswordValidations()}
                <div className={"link-and-button"}>
                   <span className={"login-redirect"}>
                        <Link to={ROUTES.LOGIN} className="link" style={linkStyle}>
                            Already have an account?
                        </Link>
                    </span>
                    <Button {...buttonProps}>
                        Sign Up
                    </Button>
                </div>
            </form>
        </Paper>
    );
}


export default RegisterPage;