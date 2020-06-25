import React from 'react';
import Card from "@material-ui/core/Card";

import Logo from '../../assets/logo.js';
import './about-page.scss';

function AboutPage(props) {
    return (
        <div className={"about-page"}>
            <div className={"svg"}>
                {Logo}
            </div>
        </div>
    )
}

export default AboutPage;