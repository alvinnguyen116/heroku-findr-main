import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOpenRoundedIcon from '@material-ui/icons/LockOpenRounded';
import './password.scss';


/**
 * @param helperText {string}
 * @param onChange {function}
 * @param className {string}
 * @param error {boolean}
 * @param password {string}
 * @desc An input component for collecting a user's password.
 */
function Password({placeholder = '', onChange, className, error = false, password = ''}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [showPassword, setShowPassword] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const endAdornment = (
        <InputAdornment position="end">
            <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={e => e.preventDefault()}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
        </InputAdornment>
    );

    const startAdornment = (
        <InputAdornment position="start">
            <LockOpenRoundedIcon  style={{'fill' : password && error ? 'red' : (isFocus ? 'var(--primary-color)' : 'rgba(0,0,0,.54)')}}/>
        </InputAdornment>
    );

    const passwordProps = {
        className: `password ${className}`,
        error: !!password && error,
        onChange,
        placeholder: placeholder ? placeholder : 'Password',
        onFocus: () => setIsFocus(true),
        onBlur: () => setIsFocus(false),
        type: showPassword ? "text" : "password",
        label: "Password",
        InputProps: {
            startAdornment,
            endAdornment,
            spellCheck: false,
            value: password
        }
    };

    return (<TextField {...passwordProps} />);
}

export default Password;