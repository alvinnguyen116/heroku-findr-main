import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import {setBackdrop, setBackdrop2} from "../../../redux/actions/app";
import ToolTip from "../../tooltip/tooltip";
import Crop from "../../crop/crop";
import './edit-profile-picture.scss';
import {dispatchError} from "../../../utils";

function EditProfilePicture({setBlob, blobURL, src, setSrc, setFile, appState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const {backdropElement2} = appState;

    // METHODS ---------------------------------------------------------------------------------------------------------

    /**
     * @param src {string}
     * @desc A helper method for creating a Crop
     * component out of an image src.
     */
    const createReactCrop = src => {
        const props = {src, setBlob};
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
                    dispatch(setBackdrop2(createReactCrop(reader.result)));
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
        id: "raised-button-file-2",
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
        if (blobURL && !backdropElement2) {
            const props = {
                variant: "contained",
                className: "image-preview",
                onClick: () => dispatch(setBackdrop2(createReactCrop(src)))
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
        <div className={"edit-profile-picture"}>
            <div className={"input-upload"}>
                <input {...inputProps}/>
                <label htmlFor="raised-button-file-2">
                    <Button {...buttonProps}>
                        <PhotoCamera />
                        <span>Upload</span>
                    </Button>
                </label>
            </div>
            {renderPreview()}
        </div>
    )
}

const mapStateToProps = state => ({
   appState: state.app
});

export default connect(mapStateToProps)(EditProfilePicture);