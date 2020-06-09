import React from "react";
import './tooltip.scss';

function ToolTip({children, label}) {
    return (
        <div className={"tooltip"}>
            {children}
            <div className={"tooltip-text"}>
                {label}
            </div>
        </div>
    )
}

export default ToolTip;