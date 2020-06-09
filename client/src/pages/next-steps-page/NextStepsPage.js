import React, {useState, useMemo, useEffect, useReducer} from 'react';
import "regenerator-runtime/runtime.js";
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Profile from '../../components/profile/profile';
import {FONTS} from '../../utils/enums';
import LinearProgress from '@material-ui/core/LinearProgress';
import StepOne from './step-1/step-one';
import StepTwo from './step-2/step-two';
import StepThree from "./step-3/step-three";
import StepFour from './step-4/step-four';
import StepFive from "./step-5/step-five";
import StepSix from './step-6/step-six';
import StepSeven from "./step-7/step-seven";
import {THEMES} from '../../utils/theme';
import {ROUTES} from '../../utils/enums';
import Button from "@material-ui/core/Button";
import {reroute, fetchNewToken, setPreloadDone} from "../../redux/actions/app";
import {profileUpdate, updateProfilePicture} from '../../redux/actions/profile';
import {isEmptyProfile, dispatchError} from "../../utils";
import {propertyUpdate} from "../../redux/actions/profile";
import reducer from "../../redux/reducers/profile";
import './next-steps-page.scss';

//todo: refactor and research useReducer

/**
 * @desc The Next Steps Page component.
 *
 * Responsibilities:
 *  - Collects user information for all step.
 *    Disables next and submit if there is an
 *    error.
 */
function NextStepsPage({profileState, appState, dispatch}) {

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const INITIAL_STATE = {
         catchphrase: {
             quote: '',
             font: FONTS.AMATIC
         },
         name: {
             first: '',
             last: ''
         },
         aboutMe: '',
         gifs: [],
         tags: [],
         theme: {
             ...THEMES.light.default,
             mode: 'light',
             name: 'default'
         }
    };
    const {preloadDone} = appState;
    const profileCompleted = !isEmptyProfile(profileState);

    // COMPONENT STATE -------------------------------------------------------------------------------------------------

    const [currentStep, setCurrentStep] = useState(0);
    const [localProfileState, profileDispatch] = useReducer(reducer, INITIAL_STATE);
    const {catchphrase, gifs, name, tags, aboutMe, theme} = localProfileState;

    // COMPONENT STATE (STEPS) -----------------------------------------------------------------------------------------

    // STEP 1
    const stepOneError = !name.first || !name.last;

    // STEP 2
    const [src, setSrc] = useState('');
    const [file, setFile] = useState();
    const [blob, setBlob] = useState();
    const [blobURL, setBlobURL] = useState('');
    const stepTwoError = !blob || !file;

    // STEP 3
    const stepThreeError = !aboutMe || aboutMe.length < 30;

    // STEP 4
    const stepFourError = tags.length < 2;

    // STEP 5
    const stepFiveError = catchphrase.quote.length < 5;

    // STEP 6
    const [searchValue, setSearchValue] = useState('');
    const stepSixError = gifs.length < 4;

    // SIDE EFFECTS ----------------------------------------------------------------------------------------------------

    /**
     * @desc If the user profile is not empty,
     * redirect back to main page.
     */
    useEffect(() => {
        if (preloadDone && profileCompleted) dispatch(reroute(ROUTES.FIND_PEOPLE));
    }, [preloadDone, profileCompleted]);

    /**
     * @desc Whenever the blob changes,
     * revoke the previous URL if exists,
     * and generate a new one for preview.
     */
    useEffect(() => {
        blobURL && URL.revokeObjectURL(blobURL);
        blob && setBlobURL(URL.createObjectURL(blob));
    }, [blob]);

    // COMPONENTS (STEPS) ----------------------------------------------------------------------------------------------

    const renderStepOne = () => {
        const nameChange = property => e => {
            try {
                const value = {
                    ...localProfileState.name,
                    [property] : e.target.value
                };
                profileDispatch(propertyUpdate({property: 'name', value}));
            } catch (err) {
                dispatchError(err);
            }

        };

        return (
              <StepOne
                  values={[name.first, name.last]}
                  onChanges={[nameChange('first'), nameChange('last')]}/>
        );
    };

    const renderStepTwo = () => {
        const props = {src, setSrc, blobURL, setBlob, setFile, name: name.first.trim()};
        return (<StepTwo {...props}/>);
    };

    const renderStepThree = () => {
        const props = {
            setTextArea: value => profileDispatch(propertyUpdate({property: 'aboutMe', value})),
            value: aboutMe,
            charLimit: 250
        };
        return (<StepThree {...props}/>);
    };

    const renderStepFour = () => {
        const props = {
            values: tags,
            setValues: value => profileDispatch(propertyUpdate({property: 'tags', value}))
        };
        return (<StepFour {...props}/>);
    } ;

    const renderStepFive = () => {
        const catchphraseChange = property => value => {
            profileDispatch(propertyUpdate({
                property: 'catchphrase',
                value: {
                    ...catchphrase,
                    [property] : value
                }
            }));
        };
        const props = {
            quote: catchphrase.quote,
            setQuote: catchphraseChange('quote'),
            font: catchphrase.font,
            setFont: catchphraseChange('font')
        };
        return (<StepFive {...props}/>)
    };

    const renderStepSix = () => {
        const props = {
            gifs,
            setGifs: value => profileDispatch(propertyUpdate({property: 'gifs', value})),
            searchValue,
            setSearchValue};
        return (<StepSix {...props}/>);
    };

    const renderStepSeven = () => {
        const props = {
            theme,
            setTheme: value => profileDispatch(propertyUpdate({property: 'theme', value}))
        };
        return (<StepSeven {...props}/>);
    };

    // CONSTANTS -------------------------------------------------------------------------------------------------------

    const stepFunctions = [
        renderStepOne,
        renderStepTwo,
        renderStepFive,
        renderStepThree,
        renderStepFour,
        renderStepSix,
        renderStepSeven
    ];

    const stepErrors = [stepOneError, stepTwoError, stepFiveError,stepThreeError, stepFourError, stepSixError, false];

    // HANDLERS --------------------------------------------------------------------------------------------------------

    const onClick = async () => {
        if (stepFunctions.length - 1 === currentStep) {
            const profileUpdateCB = () => dispatch(profileUpdate({
                ...localProfileState,
                name: {
                    first: localProfileState.name.first.trim(),
                    last: localProfileState.name.last.trim(),
                },
                successCallback: () => {
                    dispatch(setPreloadDone(true));
                }
            }));

            const fetchNewTokenWrapper = successCallback => () => {
                dispatch(fetchNewToken({successCallback}));
            };

            const updateProfilePictureWrapper = ({successCallback = () => {}, failureCallback = () => {}}) => () => {
                return dispatch(updateProfilePicture({
                    original: file,
                    cropped: new File(
                        [blob],
                        `${name.first}-${name.last}-profilePicture`,
                        {lastModified: +(new Date()), type: blob.type}
                    ),
                    successCallback,
                    failureCallback
                }));
            };

            dispatch(setPreloadDone(false));
            dispatch(reroute(ROUTES.MY_PROFILE));
            return updateProfilePictureWrapper({
                successCallback: profileUpdateCB,
                failureCallback: fetchNewTokenWrapper(updateProfilePictureWrapper({
                    successCallback: profileUpdateCB
                }))
            })()
        }
        setCurrentStep(currentStep + 1);
    };

    // COMPONENTS ------------------------------------------------------------------------------------------------------

    const backButtonProps = {
        disabled: currentStep === 0,
        color: 'secondary',
        variant: 'contained',
        onClick: () => setCurrentStep(currentStep - 1)
    };

    const nextButtonProps = {
        disabled: stepErrors[currentStep],
        color: currentStep === stepFunctions.length - 1 ? "primary" : "secondary",
        variant: 'contained',
        onClick: () => onClick().then()
    };

    const progressProps = {
        className: 'progress',
        variant: "determinate",
        value: (currentStep /(stepFunctions.length - 1)) * 100,
        color: currentStep === stepFunctions.length - 1 ? "primary" : "secondary",
        'data-content': (currentStep / 5) * 100
    };

    /**
     * @desc Memoize the profile so the information doesn't change until the user
     * moves away from the current step or the current theme changes.
     */
    const memoizedProfile = useMemo(() => {
        const props = {
            className: "profile-preview custom-scrollbar",
            ...localProfileState,
            name: {
                first: localProfileState.name.first.trim(),
                last: localProfileState.name.last.trim(),
            },
            profilePicture: {
                file: blobURL
            }
        };
        return (<Profile {...props}/>);
    }, [currentStep, theme]);

    //todo: optional ig step
    if (preloadDone && !profileCompleted) {
        return (
            <div className={'next-steps-page'}>
                {memoizedProfile}
                <Paper elevation={3} className={"steps fade-in paper"}>
                    <LinearProgress {...progressProps}/>
                    <div className={"buttons"}>
                        <Button {...backButtonProps}>Back</Button>
                        <Button {...nextButtonProps}>{stepFunctions.length - 1 === currentStep ? 'Submit' : 'Next'}</Button>
                    </div>
                    <div className={"current-step"}>
                        {stepFunctions[currentStep]()}
                    </div>
                </Paper>
            </div>
        );
    }
    return null;
}

const mapStateToProps = state => ({
    profileState: state.profile,
    appState: state.app
});

export default connect(mapStateToProps)(NextStepsPage);