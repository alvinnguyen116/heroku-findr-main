import React, {useEffect, useState} from 'react';
import {useChips} from "../../../utils/hooks";
import {dispatchError} from "../../../utils";
import ChipInput from "material-ui-chip-input";
import './edit-tags.scss';

function EditTags({tags, setTags, setError, handlers}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [inputValue, setInputValue] = useState('');
    const [onAdd, onDelete] = useChips({values: tags, setValues: setTags, setInputValue});

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!tags || !tags.length) {
            setError(true);
        } else {
            setError(false);
        }
    },[tags]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const chipProps = {
        className: "tags-search",
        value: tags,
        fullWidth: true,
        onAdd,
        onDelete,
        inputValue,
        ...handlers,
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
        <div className={"edit-tags"}>
            <ChipInput {...chipProps} placeholder={"Press 'Enter' after each tag"}/>
        </div>
    );
}

export default EditTags;