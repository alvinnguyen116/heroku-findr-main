import React from 'react';
import {useVirtualScroll} from "../../../utils/hooks";
import './profile-button.scss';

function ProfileButton({className = '', profilePicture = {file: ''},
                        name={first:'', last: ''},
                        tags = [], onClick = () => {}, showDefault=false}) {

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [ref, imgLoaded] = useVirtualScroll(profilePicture.file);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const tagElements = tags.map((tag,i) => <span className={'tag'} key={i}>#{tag}</span>);

    const profileIconStyle = {backgroundColor: `rgba(0,0,0,.3)`};
    if (!showDefault && imgLoaded) profileIconStyle['backgroundImage'] = `url(${profilePicture.file})`;
    if (showDefault) className += ' default loading-bg';
    return (
        <div className={`profile-button ${className}`} ref={ref} onClick={onClick}>
            <div className={`profile-container ${className}`}>
                <div className={"profile-icon image-icon"} style={profileIconStyle}/>
                <div className={"description"}>
                    <div className={"name"}>
                        {name.first} {name.last}
                    </div>
                    <div className={"tags"}>
                        {tagElements}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileButton;