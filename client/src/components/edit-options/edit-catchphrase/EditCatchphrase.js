import React, {useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {FONTS} from "../../../utils/enums";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import './edit-catchphrase.scss';

function EditCatchphrase({quote, setQuote, font, setFont, handlers, setError}) {

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!quote) {
            setError(true);
        } else {
            setError(false);
        }
    }, [quote]);


    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderEndAdornment = () => {
        if (quote) {
            return (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Clear catchphrase area"
                        onClick={() => setQuote('')}>
                        <CloseIcon/>
                    </IconButton>
                </InputAdornment>
            );
        }
        return null;
    };

    const inputProps = {
        className: "quote-field",
        label: "Catchphrase",
        onChange: e => setQuote(e.target.value),
        type: "text",
        InputProps: {
            spellCheck: false,
            value: quote,
            endAdornment: renderEndAdornment(),
            ...handlers
        }
    };

    const selectProps = {
        value: font,
        onChange: e => setFont(e.target.value),
        ...handlers
    };

    /**
     * @desc Renders the catchphrase preview with the selected
     * typeface.
     */
    const renderPreview = () => {
        if (quote) {
            return (
                <div className={`quote-preview`}>
                    <span className={`quote ${font}`}>{quote}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={"edit-catchphrase"}>
            <div className={"input-area"}>
                <TextField {...inputProps}/>
                <Select {...selectProps}>
                    <MenuItem value={FONTS.AMATIC}>Amatic</MenuItem>
                    <MenuItem value={FONTS.AMIRI}>Amiri</MenuItem>
                    <MenuItem value={FONTS.ROBOTO}>Roboto</MenuItem>
                    <MenuItem value={FONTS.ROBOTO_MONO}>Roboto Mono</MenuItem>
                    <MenuItem value={FONTS.SACRAMENTO}>Sacramento</MenuItem>
                    <MenuItem value={FONTS.VT323}>VT323</MenuItem>
                </Select>
            </div>
            {renderPreview()}
        </div>
    )
}

export default EditCatchphrase;