import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

/**
 * @param helperText {string}
 * @param onChange {function}
 * @param className {string}
 * @param error {boolean}
 * @desc An input component for collecting a user's password.
 */
function Password({helperText, onChange, className, error}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [showPassword, setShowPassword] = useState(false);

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

    const passwordProps = {
        className,
        error,
        onChange,
        helperText: helperText,
        type: showPassword ? "text" : "password",
        label: "Password",
        autoComplete: "current-password",
        InputProps: {
            endAdornment,
            spellCheck: false
        }
    };

    return (<TextField {...passwordProps} />);
}

export default Password;