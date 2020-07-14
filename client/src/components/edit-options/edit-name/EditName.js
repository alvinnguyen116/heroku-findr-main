import React, {useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import './edit-name.scss';

function EditName({name, onChange, setError, handlers}) {

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!name.first.trim() || !name.last.trim()) {
            setError(true)
        }  else {
            setError(false);
        }
    }, [name.first, name.last]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const firstNameProps = {
        label: "First Name",
        onChange: onChange('first'),
        type: "text",
        InputProps: {
            spellCheck: false,
            value: name.first,
            ...handlers
        }
    };

    const lastNameProps = {
        label: "Last Name",
        onChange: onChange('last'),
        type: "text",
        InputProps: {
            spellCheck: false,
            value: name.last,
            ...handlers
        }
    };

    return (
        <div className={'edit-name'}>
            <TextField {...firstNameProps}/>
            <TextField {...lastNameProps}/>
        </div>
    );
}

export default EditName;