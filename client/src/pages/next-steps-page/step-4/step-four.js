import React, {useState} from "react";
import ChipInput from 'material-ui-chip-input'
import {useChips} from '../../../utils/hooks';
import {dispatchError} from "../../../utils";
import './step-four.scss';

/**
 * @param values {string[]}
 * @param setValues {function}
 * @desc The fourth step of a form for the Next Steps Page.
 * Collects the tags a user would like to associated with for
 * search.
 */
function StepFour({values, setValues}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [inputValue, setInputValue] = useState('');
    const [onAdd, onDelete] = useChips({values, setValues, setInputValue});

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const chipProps = {
        className: "tags-search",
        value: values,
        fullWidth: true,
        onAdd,
        onDelete,
        inputValue,
        onUpdateInput: e => {
            try {
                const {value} = e.target;
                if (typeof value === "string") {
                    setInputValue(value.replace("#", ''));
                }
            } catch (err) {
                dispatchError(err);
            }
        }
    };

    return (
        <div className={"step-five fade-in"}>
            <h1 className={"steps-title"}>
                 Interesting...<br/>
                <strong>Which <em>#tags</em> should people use to find you?</strong> <br/>
            </h1>
            <ChipInput {...chipProps} placeholder={"Press 'Enter' after each tag"}/>
        </div>
    )
}

export default StepFour;