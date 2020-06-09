import {useEffect, useState} from 'react';
import {dispatchError} from "./index";
import {useInView} from "react-intersection-observer";

/**
 * @param validator {function}
 * @desc An input hook. Supplies value,
 * error, and an onChange handler.
 */
function useInput(validator = () => true) {

    const [error, setError] = useState(false);
    const [value, setValue] = useState('');

    const onChange = e => {
        try {
            const {value} = e.currentTarget;
            setValue(value);
            if (value && !validator(value)) {
                setError(true);
            } else {
                setError(false);
            }
        } catch (err) {
            dispatchError(err);
        }
    };
    return [value, error, onChange];
}

/**
 * @param values {[]}
 * @param setValues {function}
 * @desc Supplies an onAdd and onDelete
 * handlers functions for an array of values.
 */
function useChips({values,setValues}) {
    const onDelete = valueToDelete => {
        const newValues = [...values];
        const deleteIndex = newValues.findIndex(value => valueToDelete === value);
        if (deleteIndex > -1) {
            newValues.splice(deleteIndex, 1);
            setValues(newValues);
        }
    };
    const onAdd = valueToAdd => setValues([...values, valueToAdd]);
    return [onAdd, onDelete];
}

function useVirtualScroll(url) {

    const [imgLoaded, setImgLoaded] = useState(false);
    const [ref, inView] = useInView();

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc If the image is in view
     * and has not yet loaded, attempt
     * to loaded programmatically.
     */
    useEffect(() => {
        let mounted = true;
        if (inView && !imgLoaded) {
            const img = new Image();
            img.onload = () => {
                if (mounted) setImgLoaded(true);
            };
            url && img.setAttribute('src', url);

            return () => {
                mounted = false;
            }
        }
    }, [inView]);

    return [ref, imgLoaded];
}
export {
    useInput,
    useChips,
    useVirtualScroll
}