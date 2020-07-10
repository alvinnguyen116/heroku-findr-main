import React from 'react';
import GoogleLogo from "../../../assets/google";
import {AUTH_TYPE, createGoogleUrl} from "../../../utils/enums";
import './google.scss';

function GoogleAuth({className = '', type}) {

    const hyperlinkProps = {
        href: createGoogleUrl(type),
        target: "_self"
    };

    return (
        <a {...hyperlinkProps}>
            <div className={`google-auth ${className}`}>
                <GoogleLogo className={'google-logo'}/>
                <div className={"text"}>
                    {type === AUTH_TYPE.LOGIN ? 'Sign in with Google' : 'Sign up with Google'}
                </div>
            </div>
        </a>
    );
}

export default GoogleAuth;