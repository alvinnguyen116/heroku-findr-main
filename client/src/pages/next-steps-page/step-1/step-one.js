import React from "react";
import TextField from "@material-ui/core/TextField";
import './step-one.scss';

/**
 * @param values {string[]}
 * @param errors {boolean}
 * @param onChanges {function}
 * @desc The first step in a form of the
 * Next Steps Page. Collects the first and
 * last name of the new user.
 */
function StepOne({values, onChanges}) {

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const firstNameProps = {
        label: "First Name",
        onChange: onChanges[0],
        type: "text",
        InputProps: {
            spellCheck: false,
            value: values[0]
        }
    };

    const lastNameProps = {
        label: "Last Name",
        onChange: onChanges[1],
        type: "text",
        InputProps: {
            spellCheck: false,
            value: values[1]
        }
    };

    return (
        <div className={"step-one fade-in"}>
            <h1 className={"steps-title"}>
                Hello! <span role="img" aria-label={"Happy Face"}>&#128512;</span><br/>
                <strong>What is your name?</strong>
            </h1>
            <div className={"inputs"}>
                <TextField {...firstNameProps}/>
                <TextField {...lastNameProps}/>
            </div>
        </div>
    ) ;
}

export default StepOne;
