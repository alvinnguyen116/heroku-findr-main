import React from "react";
import {dispatchError} from "../../../utils";
import './step-three.scss';

/**
 * @param value {string}
 * @param setTextArea {function}
 * @param charLimit {number}
 * @desc The third step of a form for the Next Steps Page.
 * Collects the "About me" information for a user profile.
 */
function StepThree({value, setTextArea, charLimit}) {

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @param e
     * @desc On the change event, update the text
     * if under the character limit.
     */
    const onChange = e => {
        try {
            const {value} = e.target;
            if (value.length <= charLimit) {
                setTextArea(value);
            }
        } catch (err) {
            dispatchError(err);
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    return (
        <div className={"step-three fade-in"}>
            <h1 className={"steps-title"}>
                That has a nice ring to it!<br/>
                <strong>Tell me more about yourself.</strong>
            </h1>
            <textarea
                spellCheck={false}
                placeholder={"Hi, everyone! \n \nI'm a Bay Area native looking for some..."}
                onChange={onChange}
                value={value}/>
            <div className={"char-limit"}>
                <sup>{value.length}</sup>&frasl;<sub>{charLimit}</sub>
            </div>
        </div>
    )
}

export default StepThree;