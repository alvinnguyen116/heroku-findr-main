import React from 'react';
import Card from "@material-ui/core/Card";
import Logo from '../../assets/logo.js';
import './about-page.scss';

function AboutPage(props) {

    const renderLogos = ()=> {
        return [...Array(15).keys()].map(i => <Logo key={i}/>);
    };

    return (
        <div className={"about-page fade-in"}>
            <div className={"svg"}>
                {renderLogos()}
            </div>
            <Card elevation={3} className={"description"}>
                <div className={"row"}>
                    <div>
                        Welcome, Friends! <br/> <br/>
                        My name is Alvin and I am a Front End Developer. <br/> <br/>
                        <span className={"findr"}>Findr</span> is a hobby project to stave boredom and express technical creativity.
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"label"}>Motivation</div>
                    <div>I wanted to be able to find people quickly associated with some tag.</div>
                </div>
            </Card>
        </div>
    )
}

export default AboutPage;