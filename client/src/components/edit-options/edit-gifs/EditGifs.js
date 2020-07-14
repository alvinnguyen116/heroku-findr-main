import React, {useEffect} from 'react';
import StepSix from "../../../pages/next-steps-page/step-6/step-six";
import './edit-gifs.scss';

function EditGifs({gifs, setGifs, searchValue, setSearchValue, setError}) {

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!gifs || gifs.length < 4) {
            setError(true);
        } else {
            setError(false);
        }
    });

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const props = {
        gifs, setGifs, searchValue, setSearchValue,
        className: 'edit-gifs',
        isProfileUpdate: true
    };

    return (<StepSix {...props}/>);
}

export default EditGifs;