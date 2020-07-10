import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Email from '../../components/input/email/Email';
import Password from "../../components/input/password/Password";
import Button from "@material-ui/core/Button";
import {register} from "../../redux/actions/app";
import {isValidEmail} from "../../utils/validators";
import GoogleAuth from "../../components/input/google/Google";
import {useInput} from "../../utils/hooks";
import './register-page.scss';
import {AUTH_TYPE} from "../../utils/enums";
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
    const [password2, setPassword2] = useState('');

    // Password Validations
    const [passCharLimit, setPassCharLimit] = useState(false);
    const [passNumber, setPassNumber] = useState(false);
    const [passUpper, setPassUpper] = useState(false);
    const [passSpecial, setPassSpecial] = useState(false);
    const [passMatch, setPassMatch] = useState(false);

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {dispatch} = store;
    const [emailDone, setEmailDone] = useState(false);
    const passwordError1 = !password || !passCharLimit || !passNumber || !passUpper || !passSpecial;
    const passwordError =  passwordError1 || !passMatch;
    const disableSubmit = emailDone ? passwordError : (emailError || !email);

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

        if (password && password2 && password === password2) {
            setPassMatch(true);
        } else {
            setPassMatch(false);
        }
    }, [password, password2]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const onClick = e => {
        e.preventDefault();
        if (!emailDone) {
            setEmailDone(true);
        } else {
            dispatch(register({email, password}));
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderPasswordValidations = () => {
        return (
            <div className={"validations"}>
                <ul>
                    <li className={`${passCharLimit ? 'done' : ''}`}>
                        Must be at least 8 characters
                    </li>
                    <li className={`${passNumber ? 'done' : ''}`}>
                       Must contain a number
                    </li>
                    <li className={`${passUpper ? 'done' : ''}`}>
                      Must contain a capital letter
                    </li>
                    <li className={`${passSpecial ? 'done' : ''}`}>
                        Must contain one or more: (! @ # % &)
                    </li>
                    <li className={`${passMatch ? 'done' : ''}`}>
                        Must match
                    </li>
                </ul>
            </div>
        );
    };

    const renderEmailOrPassword = () => {
        if (emailDone) {
            const props1 = {
                onChange: e => setPassword(e.target.value),
                password,
                error: passwordError1
            };
            const props2 = {
                onChange: e => setPassword2(e.target.value),
                password: password2,
                placeholder: 'Re-type Password',
                error: !passMatch
            };

            return (
                <>
                    <Password {...props1} />
                    <Password {...props2} />
                    {renderPasswordValidations()}
                </>
            );
        }
        return (
            <Email className={"email"} error={emailError} onChange={onChangeEmail} email={email}/>
        );
    };

    const buttonProps = {
        className: "button",
        variant: "contained",
        color: "secondary",
        type: "submit",
        disabled: disableSubmit,
        onClick
    };

    const backButtonProps = {
        className: "button",
        variant: "contained",
        color: "secondary",
        type: "button",
        disabled: !emailDone,
        onClick: () => setEmailDone(false)
    };

    return (
        <Paper elevation={3}  className={"register-page fade-in"}>
            <form>
                {renderEmailOrPassword()}
                <div className={"link-and-button"}>
                    <Button {...backButtonProps}>
                        Back
                    </Button>
                    <Button {...buttonProps}>
                        {emailDone ? 'Sign Up' : 'Next'}
                    </Button>
                </div>
            </form>
            {!emailDone ? <GoogleAuth type={AUTH_TYPE.REGISTER} className={"google"}/> : null}
        </Paper>
    );
}


export default RegisterPage;