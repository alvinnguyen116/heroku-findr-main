import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import TextField from "@material-ui/core/TextField";
import './search.scss';

/**
 * @param value  {string}
 * @param setValue {function}
 * @param onChange {function}
 * @desc A controlled input component for displaying
 * a search bar.
 */
function Search({value, setValue, onChange, handlers = {}, placeholder = 'Search'}) {

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
            ...handlers
        }
    };

    return (<TextField {...inputProps}/>);
}

export default Search;
