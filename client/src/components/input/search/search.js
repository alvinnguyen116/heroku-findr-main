import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import TextField from "@material-ui/core/TextField";
import {setKeyboardShortcuts} from "../../../redux/actions/app";
import store from '../../../redux/store';
import './search.scss';

/**
 * @desc A controlled input component for displaying
 * a search bar.
 */
function Search({value, setValue, handlers = {}, placeholder = 'Search'}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {dispatch} = store;

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const startAdornment = (
        <InputAdornment position="start" className={"search-button"}>
            <SearchIcon/>
        </InputAdornment>
    );

    const inputProps = {
        className: "search",
        placeholder,
        onChange: e => setValue(e.target.value),
        type: "text",
        variant: "outlined",
        InputProps: {
            value,
            spellCheck: false,
            startAdornment,
            onFocus: () => dispatch(setKeyboardShortcuts(false)),
            onBlur: () => dispatch(setKeyboardShortcuts(true)),
            ...handlers
        }
    };

    return (<TextField {...inputProps}/>);
}

export default Search;
