import React, {useEffect} from 'react';
import './edit-about-me.scss';
import {dispatchError} from "../../../utils";

function EditAboutMe({textArea, setTextArea, charLimit, setError, handlers}) {

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!textArea) {
            setError(true);
        } else {
            setError(false);
        }
    }, [textArea]);

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

    return (
        <div className={"edit-about-me"}>
            <textarea
                spellCheck={false}
                placeholder={"Hi, everyone! \n \nI'm a Bay Area native looking for some..."}
                onChange={onChange}
                {...handlers}
                value={textArea}/>
            <div className={"char-limit"}>
                <sup>{textArea.length}</sup>&frasl;<sub>{charLimit}</sub>
            </div>
        </div>
    );
}

export default EditAboutMe;