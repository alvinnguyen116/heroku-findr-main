import React, {useState, useContext, useEffect, useRef} from "react";
import {connect} from 'react-redux';
import {MEDIA_TYPES} from '../../../utils/enums';
import IconButton from '@material-ui/core/IconButton';
import Search from '../../../components/input/search/search';
import GifIcon from '@material-ui/icons/Gif';
import SentimentVerySatisfiedOutlinedIcon from '@material-ui/icons/SentimentVerySatisfiedOutlined';
import {debouncedGifSearch} from "../../../utils";
import {ThemeContext} from "../../../utils/theme";
import Gif from '../../../components/gif/gif';
import './step-six.scss';

/**
 * @desc The sixth step of a form for the Next Steps Page.
 * Collect the user's favorite gifs and stickers.
 */
function StepSix({appState, gifs, setGifs, searchValue, setSearchValue, isProfileUpdate = false,
                     className = ''}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const Theme = useContext(ThemeContext);
    const {gifs: gifObjects} = appState;

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [currentGifType, setCurrentGifType] = useState(MEDIA_TYPES.GIF);

    // REFERENCES ------------------------------------------------------------------------------------------------------

    const previewRef = useRef();
    const gifContainerRef = useRef();

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc Whenever the search value or the
     * current gif type changes, update the gifs.
     */
    useEffect(() => {
        debouncedGifSearch({term: searchValue, type: currentGifType});
    }, [searchValue, currentGifType]);


    useEffect(() => {
        if (previewRef && previewRef.current) {
            previewRef.current.scrollTop = previewRef.current.scrollHeight;
        }
    }, [gifs]);

    useEffect(() => {
        if (gifContainerRef && gifContainerRef.current) {
            gifContainerRef.current.scrollTop = 0;
        }
    }, [gifObjects]);

    // HANDLERS --------------------------------------------------------------------------------------------------------

    /**
     * @param i {number}
     * @desc A HOF for removing a specific media
     * by index.
     */
    const onDelete = i => () => {
        const newGifs = [...gifs];
        newGifs.splice(i,1);
        setGifs(newGifs);
    };

    /**
     * @param target
     * @desc A HOF for the add event. Adds a new media
     * if there is less than 4 and it is new.
     */
    const onAdd = target => () => {
        if (gifs.length < 4 && !gifs.map(gif => gif.url).includes(target.url)) {
            setGifs([...gifs, target]);
        }
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const bgStyle = {backgroundColor: Theme.primary.A400};

    /**
     * @desc If there is at least 1 selected media,
     * display the gifs in a vertical Paper container.
     */
    const renderGifPreview = () => {
        if (gifs.length) {
            const gifComponents = gifs.map((gif, i) =>
                <Gif gifObj={gif} onClick={onDelete(i)} FIXED_WIDTH={115} key={gif.url}/>
            );
            return (
                <div className={"gif-preview hide-scroll-parent fade-in"}>
                    <div className={"hide-scroll-child"} ref={previewRef}>
                        {gifComponents}
                    </div>
                </div>
            )
        }
        return null;
    };

    const gifButtonProps = {
        className: currentGifType === MEDIA_TYPES.GIF ? 'selected gif' : 'gif',
        'aria-label': 'Gif option',
        onClick: () => setCurrentGifType(MEDIA_TYPES.GIF)
    };

    const stickerButtonProps = {
        className: currentGifType === MEDIA_TYPES.STICKER ? 'selected' : '',
        'aria-label': 'Sticker option',
        onClick: () => setCurrentGifType(MEDIA_TYPES.STICKER)
    };

    const gifComponents = gifObjects.map(gif =>
        <Gif onClick={onAdd(gif)} gifObj={gif} key={gif.url} FIXED_WIDTH={237}/>
    );

    const searchProps = {
        value: searchValue,
        setValue: setSearchValue,
        placeholder: 'Search GIFs'
    };

    const renderNextStepsTitle = () => {
        if (!isProfileUpdate) {
            return (
                <h1 className={"steps-title"}>
                    You can find me at <em>#Sentient website</em>. <br/>
                    <strong>Choose 4 GIFs.</strong> <br/>
                </h1>
            );
        }
        return null;
    };
    return (
      <div className={`step-six fade-in ${className}`}>
          {renderNextStepsTitle()}
          <div className={"user-input"}>
              <div className={"gif-or-sticker"} style={bgStyle}>
                  <Search {...searchProps}/>
                  <div className={"gif-options"}>
                      <IconButton {...gifButtonProps}>
                        <GifIcon/>
                      </IconButton>
                      <IconButton {...stickerButtonProps}>
                          <SentimentVerySatisfiedOutlinedIcon/>
                      </IconButton>
                  </div>
                  <div className={"hide-scroll-parent"}>
                      <div className={"gif-container hide-scroll-child"} ref={gifContainerRef}>
                          {gifComponents}
                      </div>
                  </div>
              </div>
              {renderGifPreview()}
          </div>
      </div>
    );
}

const mapStateToProps = state => ({
   appState: state.app
});

export default connect(mapStateToProps)(StepSix);