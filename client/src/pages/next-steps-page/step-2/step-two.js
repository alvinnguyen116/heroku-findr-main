import React from "react";
import Button from "@material-ui/core/Button";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {setBackdrop} from "../../../redux/actions/app";
import {connect} from 'react-redux';
import {dispatchError} from "../../../utils";
import Crop from './crop';
import ToolTip from "../../../components/tooltip/tooltip";
import 'react-image-crop/lib/ReactCrop.scss';
import './step-two.scss';

/**
 * @param src {string}
 * @param setSrc {function}
 * @param blobURL {string}
 * @param setBlob {function}
 * @param setFile {function}
 * @param dispatch {function}
 * @param appState {Object}
 * @param name {string}
 * @desc The second step in a form of the Next Steps Page.
 * Collects the user profile picture and the cropped image
 * (as a Blob).
 */
function StepTwo({src, setSrc, blobURL, setBlob, setFile, dispatch, appState, name}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {backdropElement} = appState;
    // METHODS ---------------------------------------------------------------------------------------------------------

    /**
     * @param src {string}
     * @desc A helper method for creating a Crop
     * component out of an image src.
     */
    const createReactCrop = src => {
        const props = {src, setBlob,};
        return (<Crop {...props}/>);
    };

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @param e {Event}
     * @desc On the change event, read the file as a data URL
     * and set the backdrop to a Crop element with the result.
     */
    const onChange = e => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setSrc(reader.result);
                    dispatch(setBackdrop(createReactCrop(reader.result)));
                });
                reader.readAsDataURL(e.target.files[0]);
                setFile(e.target.files[0]);
            }
        } catch (err) {
            dispatchError(err);
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const inputProps = {
        accept:"image/*",
        style: {
            display: 'none'
        },
        id:"raised-button-file",
        type:"file",
        onChange
    };

    const buttonProps = {
        className: 'upload-button',
        color: 'primary',
        variant: 'contained',
        component: "span"
    };

    /**
     * @desc Render the preview if the blob exists,
     * and the backdrop element is closed.
     */
    const renderPreview = () => {
        if (blobURL && !backdropElement) {
            const props = {
                variant: "contained",
                className: "image-preview fade-in",
                onClick: () => dispatch(setBackdrop(createReactCrop(src)))
            };
            return (
                <ToolTip label={"Edit"}>
                    <div className={"preview-container"}>
                        <Button {...props}>
                            <img className={"user-profile-picture"} src={blobURL} alt={"Preview"}/>
                        </Button>
                    </div>
                </ToolTip>
            );
        }
        return null;
    };

    return (
        <div className={"step-two fade-in"}>
            <h1 className={"steps-title"}>
                Hi, <span className={"name"}>{name}</span>! <br/>
                <strong>What do you look like?</strong>
            </h1>
            <div className={"step-two-a"}>
                <div className={"input-upload"}>
                    <input {...inputProps}/>
                    <label htmlFor="raised-button-file">
                        <Button {...buttonProps}>
                            <PhotoCamera />
                            <span>Upload</span>
                        </Button>
                    </label>
                </div>
                {renderPreview()}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
   appState: state.app
});

export default connect(mapStateToProps)(StepTwo);