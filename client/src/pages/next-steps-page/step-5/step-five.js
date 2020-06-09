import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import {FONTS} from '../../../utils/enums';
import './step-five.scss';

/**
 * @param quote {string}
 * @param setQuote {function}
 * @param font {string}
 * @param setFont {function}
 * @desc The fifth step of a form for the Next Steps Page.
 * Collects the user quote information and font preference.
 */
function StepFive({quote,setQuote, font, setFont}) {

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
            endAdornment: renderEndAdornment()
        }
    };

    const selectProps = {
        value: font,
        onChange: e => setFont(e.target.value)
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
        <div className={"step-five fade-in"}>
            <h1 className={"steps-title"}>
                Nice Pic <span role={"img"} aria-label={"Face with glasses"}>&#128526;</span><br/>
                <strong>What is your favorite quote?</strong>
            </h1>
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

export default StepFive;