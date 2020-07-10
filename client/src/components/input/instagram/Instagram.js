import React from 'react';
import {createInstagramUrl} from "../../../utils/enums";
import InstagramLogo from "../../../assets/instagram";
import './instagram.scss';

function LinkInstagram() {

    const hyperLinkProps = {
        href: createInstagramUrl(),
        target: '_self'
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    return (
        <a {...hyperLinkProps}>
            <div className={"instagram"}>
                <div className={"logo"}>
                    <InstagramLogo/>
                </div>
                <div className={"text"}>
                    Link your Account
                </div>
            </div>
        </a>
    );
}

export default LinkInstagram;