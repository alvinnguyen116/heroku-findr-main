import React, {useEffect} from 'react';
import StepSeven from "../../../pages/next-steps-page/step-7/step-seven";
import './edit-theme.scss';

function EditTheme({theme, setTheme, setError}) {

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!theme) {
            setError(true);
        } else {
            setError(false);
        }
    }, [theme]);

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const props = {
        theme, setTheme,
        className: 'edit-theme',
        isProfileUpdate: true
    };

    return (<StepSeven {...props}/>);
}

export default EditTheme;