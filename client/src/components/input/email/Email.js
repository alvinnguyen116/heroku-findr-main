import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import InputAdornment from "@material-ui/core/InputAdornment";
import './email.scss';

/**
 * @param className {string}
 * @param error {boolean}
 * @param onChange {function}
 * @param email {string}
 * @desc An input component for collecting email.
 * Accepts on onchange handler for storing state
 * outside of component.
 */
function Email({className, error, onChange, email=''}) {


    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [isFocus, setIsFocus] = useState(false);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const startAdornment = (
        <InputAdornment position="start">
            <MailOutlineRoundedIcon style={{'fill' : error ? 'red' : (isFocus ? 'var(--primary-color)' : 'rgba(0,0,0,.54)')}}/>
        </InputAdornment>
    );

    const emailProps = {
        className: `${className} email`,
        type: "email",
        label: "Email",
        placeholder: 'Email',
        error,
        onChange,
        onFocus: () => setIsFocus(true),
        onBlur: () => setIsFocus(false),
        autoComplete: "email",
        InputProps: {
            startAdornment,
            spellCheck: false,
            value: email
        }
    };

    return (<TextField {...emailProps} />);
}

export default Email;