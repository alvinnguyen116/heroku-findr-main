import React, {useCallback, useState, useRef} from "react";
import ReactCrop from "react-image-crop/dist/ReactCrop";

/**
 * @param setBlob {function}
 * @param src {string}
 * @desc A component for cropping an image. Displays
 * an image and set the new Blob object.
 */
function Crop({setBlob, src}) {

    // COMPONENT REFERENCES --------------------------------------------------------------------------------------------

    const imageRef = useRef();

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [crop, setCrop] = useState({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        aspect: 1
    });

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @desc When the image loads, update the
     * image reference.
     */
    const onImageLoaded = useCallback(image => {
        imageRef.current = image;
    },[]);

    /**
     * @param crop
     * @param cropPercent
     * @desc Every time the user drags or resize the crop,
     * update the blob.
     */
    const onComplete = (crop, cropPercent) => {
        const image = imageRef.current;
        if (image && crop.width && crop.height) {
            // set up canvas and scale variables
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            // draw to canvas
            ctx.drawImage(image,
                crop.x * scaleX, crop.y * scaleY,
                crop.width * scaleX, crop.height * scaleY,
                0, 0,
                crop.width, crop.height
            );

            // convert to blob and save
            canvas.toBlob(blob => {
                blob && setBlob(blob);
            }, 'image/jpeg');
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const reactCropProps = {
        className: 'react-crop',
        src,
        crop,
        onChange: setCrop,
        onImageLoaded,
        onComplete,
        onCropChange: (crop, percentCrop) => setCrop(percentCrop),
        minWidth: 100,
        minHeight: 100,
        ruleOfThirds: true,
        circularCrop: true,
        keepSelection: true
    };

    return (
        <ReactCrop {...reactCropProps}/>
    );
}

export default Crop;