import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import EditName from "./edit-name/EditName";
import EditProfilePicture from "./edit-profile-picture/EditProfilePicture";
import EditAboutMe from "./edit-about-me/EditAboutMe";
import EditCatchphrase from "./edit-catchphrase/EditCatchphrase";
import EditTags from "./edit-tags/EditTags";
import EditGifs from "./edit-gifs/EditGifs";
import EditTheme from "./edit-theme/EditTheme";
import {modulo} from "../../utils";
import {fetchNewToken, setKeyboardShortcuts} from "../../redux/actions/app";
import {updateProfilePicture, profileUpdate} from "../../redux/actions/profile";
import './edit-options.scss';

function EditOptions({profileState, appState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {keyboardShortcuts} = appState;
    const {catchphrase, gifs : gifsGlobal, name: globalName, tags: globalTags, aboutMe, theme : globalTheme, profilePicture} = profileState;

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [currentOptionIndex, setCurrentOptionIndex] = useState(-1);
    const [showOptions, setShowOptions] = useState(true);
    const [error, setError] = useState(false);

    const [name, setName] = useState(globalName); // NAME

    /**
     * Display: src (original), blobURL (cropped)
     * Store: file (original), blob (cropped)
     */
    const [src, setSrc] = useState(profilePicture.original.file); // PROFILE PICTURE
    const [file, setFile] = useState();
    const [blob, setBlob] = useState();
    const [blobURL, setBlobURL] = useState(profilePicture.cropped.file);

    const [textArea, setTextArea] = useState(aboutMe); // ABOUT ME

    const [quote, setQuote] = useState(catchphrase.quote); // CATCHPHRASE
    const [font, setFont] = useState(catchphrase.font);

    const [tags, setTags] = useState(globalTags); // TAGS

    const [searchValue, setSearchValue] = useState(''); // GIFS
    const [gifs, setGifs] = useState(gifsGlobal);

    const [theme, setTheme] = useState(globalTheme); // THEME

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    function keydownListener(e) {
        const {keyCode} = e;
        if (!keyboardShortcuts) return;

        if (showOptions) {
            switch(keyCode) {
                case 37:
                    setCurrentOptionIndex(modulo(currentOptionIndex - 1, 7));
                    break;
                case 38:
                    setCurrentOptionIndex(modulo(currentOptionIndex - 2, 7));
                    e.preventDefault();
                    break;
                case 39:
                    setCurrentOptionIndex(modulo(currentOptionIndex + 1, 7));
                    e.preventDefault();
                    break;
                case 40:
                    setCurrentOptionIndex(modulo(currentOptionIndex + 2, 7));
                    e.preventDefault();
                    break;
                case 13:
                    if (currentOptionIndex > -1) setShowOptions(false);
                    break;
                default:
                    break;
            }
        } else {
            switch(keyCode) {
                case 8:
                    setShowOptions(true);
                    break;
                case 13:
                    onUpdate();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * @desc Key board shortcuts
     */
    useEffect(() => {
        document.removeEventListener('keydown', keydownListener, true);
        document.addEventListener('keydown', keydownListener, true);

        return () => {
            document.removeEventListener('keydown', keydownListener, true);
        };
    }, [currentOptionIndex, showOptions, keyboardShortcuts]);

    /**
     * @desc Whenever the blob changes,
     * revoke the previous URL if exists,
     * and generate a new one for preview.
     */
    useEffect(() => {
        blobURL && URL.revokeObjectURL(blobURL);
        blob && setBlobURL(URL.createObjectURL(blob));
    }, [blob]);

    useEffect(() => {
        if (currentOptionIndex === 1) {
            if (!blob) {
                setError(true);
            } else {
                setError(false);
            }
        }
    }, [blob, currentOptionIndex]);


    // METHODS ---------------------------------------------------------------------------------------------------------

    const handlers = {
        onFocus: () => dispatch(setKeyboardShortcuts(false)),
        onBlur: () => dispatch(setKeyboardShortcuts(true))
    };

    /**
     * @param successCallback
     * @desc A helper HOF for fetching a new token before making another update call.
     * To be used in failure callbacks.
     */
    const fetchTokenWrapper = successCallback => () => {
        dispatch(fetchNewToken({successCallback}));
    };

    // COMPONENTS (EDIT) -----------------------------------------------------------------------------------------------

    const renderEditName = () => { // NAME
        const props = {
            name, setError, handlers,
            onChange: key => e => setName({...name, [key] : e.target.value})
        };
        return (
            <EditName {...props}/>
        );
    };


    const renderEditProfilePicture = () => { // PROFILE PICTURE
        const props = {setBlob, blobURL, src, setSrc, setFile, setError};
        return (
            <EditProfilePicture {...props}/>
        );
    };

    const renderEditAboutMe = () => { // ABOUT ME
        const props = {
            textArea, setTextArea, handlers, setError,
            charLimit: 250
        };
        return (
            <EditAboutMe {...props}/>
        );
    };

    const renderEditCatchphrase = () => {
        const props = {font, setFont, quote, setQuote, setError, handlers};
        return (<EditCatchphrase {...props}/>);
    };

    const renderEditTags = () => {
        const props = {tags, setTags, setError, handlers};
        return (<EditTags {...props}/>);
    };

    const renderEditGifs = () => {
        const props = {gifs, setGifs, searchValue, setSearchValue, setError};
        return (<EditGifs {...props}/>);
    };

    const renderEditTheme = () => {
        const props = {
            theme, setError,
            setTheme: selectedTheme => {
                setTheme(selectedTheme);
                const successCallback = () => dispatch(profileUpdate({theme: selectedTheme}));
                dispatch(profileUpdate({theme: selectedTheme, failureCallback: fetchTokenWrapper(successCallback)}));
            }
        };
        return (<EditTheme {...props}/>);
    };

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const optionComponents = [
        renderEditName, renderEditProfilePicture, renderEditAboutMe, renderEditCatchphrase, renderEditTags,
        renderEditGifs, renderEditTheme
    ];

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const onUpdate = () => {

        let successCallback = () => {};
        switch (currentOptionIndex) {
            case 0:
                successCallback = () => dispatch(profileUpdate({name}));
                dispatch(profileUpdate({name, failureCallback: fetchTokenWrapper(successCallback)}));
                break;
            case 1:
                const profilePicture = {};
                if (file) profilePicture['original'] = file;
                if (blob) profilePicture['cropped'] = new File(
                    [blob],
                    `${name.first}-${name.last}-profilePicture`,
                    {lastModified: +(new Date()), type: blob.type}
                );

                successCallback = () => dispatch(updateProfilePicture(profilePicture));
                dispatch(updateProfilePicture({...profilePicture,
                    failureCallback: fetchTokenWrapper(successCallback)
                }));
                break;
            case 2:
                successCallback = () => dispatch(profileUpdate({aboutMe: textArea}));
                dispatch(profileUpdate({aboutMe: textArea, failureCallback: fetchTokenWrapper(successCallback)}));
                break;
            case 3:
                successCallback = () => dispatch(profileUpdate({catchphrase: {font, quote}}));
                dispatch(profileUpdate({catchphrase: {font, quote}, failureCallback: fetchTokenWrapper(successCallback)}));
                break;
            case 4:
                successCallback = () => dispatch(profileUpdate({tags}));
                dispatch(profileUpdate({tags, failureCallback: fetchTokenWrapper(successCallback)}));
                break;
            case 5:
                successCallback = () => dispatch(profileUpdate({gifs}));
                dispatch(profileUpdate({gifs, failureCallback: fetchTokenWrapper(successCallback)}));
                break;
            default:
                break;
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------


    const renderOptions = () => {
        const options = ['Name', 'Profile Picture', 'About Me', 'Catchphrase', 'Tags', 'GIFs', 'Theme'];
        return options.map((label, i) => {
            const props = {
                key: label,
                className: `option-btn ${i === currentOptionIndex ? 'hover' : ''}`,
                onClick: () => {
                    setCurrentOptionIndex(i);
                    setShowOptions(false);
                }
            };
            return (
               <Button {...props}>
                   {label}
               </Button>
            );
        });
    };

    const renderMain = () => {
        if (showOptions) return renderOptions();
        if (optionComponents.length > currentOptionIndex) {
            return optionComponents[currentOptionIndex]();
        }
        return null;
    };

    const renderBackButton = () => {
        if (!showOptions) {
            const props = {
                className: 'back-btn',
                color: 'secondary',
                variant: 'contained',
                onClick: () => setShowOptions(true)
            };
            return (
                <Button {...props}>
                    Back
                </Button>
            );
        }
        return null;
    };

    const renderUpdateButton = () => {
        if (!showOptions && currentOptionIndex !== 6) {
            const props = {
                className: 'update-btn',
                color: 'primary',
                variant: 'contained',
                disabled: error,
                onClick: onUpdate
            };
            return (
                <Button {...props}>
                    Update
                </Button>
            );
        }
        return null;
    };

    return (
        <Card elevation={3} className={`edit-options ${showOptions ? 'show-options' : ''}`}>
            <div className={"buttons"}>
                {renderBackButton()}
                {renderUpdateButton()}
            </div>
            <div className={'main'}>
                {renderMain()}
            </div>
        </Card>
    );
}

const mapStateToProps = state => ({
    profileState: state.profile,
    appState: state.app
});

export default connect(mapStateToProps)(EditOptions);