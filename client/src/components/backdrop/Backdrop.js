import React, {useState} from 'react';
import './backdrop.scss';

function Backdrop({onClick, children, className=''}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [mousedown, setMousedown] = useState(false);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const onMouseDown = e => {
        if (e.currentTarget === e.target) {
            setMousedown(true);
        } else {
            setMousedown(false);
        }
    };

    /**
     * @desc Close the backdrop on click (IGNORE CHILDREN CLICK)
     */
    const onMouseUp = e => {
        if (e.currentTarget === e.target && mousedown) { // only click if mousedown event started on backdrop
            onClick(e);
        }
    };


    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const props = {onMouseDown, onMouseUp};

    return (
        <div className={`backdrop ${className}`} {...props}>
            {children}
        </div>
    )
}

export default Backdrop;