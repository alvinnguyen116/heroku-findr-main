import React from 'react';
import TextField from "@material-ui/core/TextField";
import './email.scss';

/**
 * @param className {string}
 * @param error {boolean}
 * @param onChange {function}
 * @desc An input component for collecting email.
 * Accepts on onchange handler for storing state
 * outside of component.
 */
function Email({className, error, onChange}) {

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const emailProps = {
        className,
        type: "email",
        label: "Email",
        error,
        helperText: error ? "Invalid Email" : "",
        onChange,
        autoComplete: "email",
        inputProps: {
            spellCheck: false
        }
    };

    return (<TextField {...emailProps} />);
}

export default Email;