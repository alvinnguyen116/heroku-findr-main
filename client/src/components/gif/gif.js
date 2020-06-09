import React from 'react';
import {useVirtualScroll} from "../../utils/hooks";
import './gif.scss';

/**
 * @param gifObj {object}
 * @param onAdd {function}
 * @param FIXED_WIDTH {number}
 * @desc A helper component for displaying a single gif.
 * Takes a gif object returned by the Giphy API.
 */
function Gif({gifObj, onClick = () => {}, FIXED_WIDTH, FIXED_HEIGHT}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {url} = gifObj;
    const height = parseInt(gifObj.height, 10);
    const width = parseInt(gifObj.width, 10);
    let scale = 1;
    if (FIXED_HEIGHT) {
        scale = FIXED_HEIGHT/height;
    } else if (FIXED_WIDTH) {
        scale = FIXED_WIDTH/width;
    }
    const scaledHeight = height * scale;
    const scaledWidth = width * scale;

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [ref, imgLoaded] = useVirtualScroll(url);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @desc Only call the onClick function
     * if the image has loaded.
     */
    const handleOnClick = () => imgLoaded && onClick();

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const style = {
        height: scaledHeight,
        width: scaledWidth
    };

    if (imgLoaded) style['backgroundImage'] = `url(${url})`;
    if (!imgLoaded) style['backgroundColor'] = 'rgba(0,0,0,.3)';

    return (<div className={"gif-object image-icon"} style={style} onClick={handleOnClick} ref={ref}/>);
}

export default Gif;