import React, {useRef, useEffect, useState} from "react";
import Card from '@material-ui/core/Card';
import Gif from '../gif/gif';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import CreateIcon from "@material-ui/icons/Create";
import Button from "@material-ui/core/Button";
import {setBackdrop} from "../../redux/actions/app";
import EditOptions from "../edit-options/EditOptions";
import store from '../../redux/store';
import './profile.scss';

function Profile({className, catchphrase, profilePicture, gifs, name, tags, aboutMe, theme, edit = false}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    let cardStyle = {
        color: 'black',
        backgroundColor: 'white'
    };

    let mode,color,style = '';
    if (theme) {
        mode = theme.mode;
        color = theme.color;
        style = theme.style;
    }
    if (mode && color && style) {
        cardStyle = {
            color: mode === "light" ? "black" : "white",
            [style] : color
        }
    }
    const {dispatch} = store;

    // REFERENCES ------------------------------------------------------------------------------------------------------

    const gifsRef = useRef();

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [scrollLeft, setScrollLeft] = useState(0);

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        const main = document.querySelector("main");
        main.scrollIntoView();
    }, [className, catchphrase, profilePicture, gifs, name, tags, aboutMe, theme]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const renderGifs = () => {
        const scrollGif = scrollLength => () => {
            const MAX_VALUE = gifsRef.current.scrollWidth - gifsRef.current.offsetWidth;
            let newValue = Math.min(
                Math.max(gifsRef.current.scrollLeft + scrollLength, 0),
                MAX_VALUE
            );
            if ((scrollLength < 0) && (newValue < 100)) {
                newValue = 0;
            } else if ((scrollLength > 0) && (MAX_VALUE - newValue < 100)) {
                newValue = MAX_VALUE;
            }
            gifsRef.current.scrollLeft = newValue;
            setScrollLeft(newValue);
        };

        if (gifs && gifs.length) {
            const gifsComponent = gifs.map(gif => {
                const onClick = () => dispatch(setBackdrop(<Gif gifObj={gif} FIXED_HEIGHT={300}/>));
                return (
                    <Card varaint="outlined" key={gif.url} className={"gif"}>
                        <Gif gifObj={gif} FIXED_HEIGHT={150} onClick={onClick}/>
                    </Card>
                );
            });
            const hiddenStyle = {visibility: 'hidden'};
            let leftStyle, rightStyle = {};

            if (scrollLeft === 0) {
                leftStyle = hiddenStyle;
            }

            if (gifsRef && gifsRef.current) {
                if (scrollLeft === gifsRef.current.scrollWidth - gifsRef.current.offsetWidth) {
                    rightStyle = hiddenStyle;
                }
            }

            return (
                <div className={"gif-container"}>
                    <IconButton onClick={scrollGif(-250)} style={leftStyle}>
                        <ArrowBackIosRoundedIcon />
                    </IconButton>
                    <div className={"gifs"} ref={gifsRef}>
                        {gifsComponent}
                    </div>
                    <IconButton onClick={scrollGif(250)} style={rightStyle}>
                        <ArrowForwardIosRoundedIcon />
                    </IconButton>
                </div>
            );
        }
        return (
            <div className={"gif-container"}>
                <div className={"gifs"}>
                    <div className={"default-gif loading-bg"}/>
                    <div className={"default-gif loading-bg"}/>
                    <div className={"default-gif loading-bg"}/>
                    <div className={"default-gif loading-bg"}/>
                </div>
            </div>
        );

    };

    const renderQuote = () => {
        if (catchphrase && catchphrase.quote && catchphrase.font) {
            return (
                <div className={"catchphrase"}>
                    <div className={`quote ${catchphrase.font}`}>
                        {catchphrase.quote}
                    </div>
                </div>
            );
        }
        return (<div className={"catchphrase"}/>);
    };

    const renderAboutMe = () => {
        if (aboutMe) {
            const newAboutMe = [];
            aboutMe.split("\n").forEach((str, i) => {
                newAboutMe.push(<span key={i}>{str}</span>);
                newAboutMe.push(<br key={`${i}-break`}/>);
            });
            return (
                <Card elevation={3} className={`about-me`} style={cardStyle}>
                    <div className={`content`}>
                        {newAboutMe}
                    </div>
                </Card>
            );
        }
        return (<Card elevation={3} className={"about-me default loading-bg"}/>);
    };

    const renderTags = () => {
        if (tags && tags.length) {
            const tagSpan = tags.map(tag => <span className={"tag"} key={tag}>#{tag}</span>);
            return (
                <div className={"tags"}>
                    {tagSpan}
                </div>
            );
        }
        return (<div className={"tags default"}/>);
    };

    const renderProfilePicture = () => {
        const onClick = () => dispatch(setBackdrop(
            <img src={profilePicture.file} alt={"User profile"} className={`enlarge-img ${mode}`}/>
        ));
        if (profilePicture && profilePicture.file) {
            const props = {
                onClick,
                src: profilePicture.file,
                alt: "User profile",
                className: mode
            };
            return (<img {...props}/>);
        }
        return (<div className={"default"}/>);
    };

    const renderName = () => {
        if (name && name.first && name.last) {
            return (<h1 className={"name"}>{name.first} <br/> {name.last}</h1>);
        }
        return (<div className={"name"}/>);
    };

    const renderEditButton = () => {
        if (edit) {
            const props = {
                variant: "contained",
                onClick: () => {
                    dispatch(setBackdrop(<EditOptions/>));
                },
                className: 'edit-btn'
            };
            return (
                <Button {...props}>
                    <CreateIcon/>
                    <span>Edit Profile</span>
                </Button>
            );
        }
        return null;
    };

    // COMPONENT SETUP -------------------------------------------------------------------------------------------------

    let middleSectionClassName = 'middle-section';
    if (!name || !name.first || !name.last) middleSectionClassName += ' default loading-bg';
    return (
        <div className={`profile ${mode} ${className}`}>
            <Card elevation={3} className={middleSectionClassName} style={cardStyle}>
                <div className={`pic-and-bio`}>
                    <div className={"profile-picture"}>
                        {renderProfilePicture()}
                        {renderName()}
                    </div>
                    {renderQuote()}
                </div>
                {renderTags()}
                {renderEditButton()}
            </Card>
            {renderAboutMe()}
            {renderGifs()}
        </div>
    )
}

export default Profile;