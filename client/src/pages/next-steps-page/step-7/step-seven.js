import React from "react";
import {THEMES} from '../../../utils/theme';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import './step-seven.scss';

function StepSeven({theme, setTheme}) {

    const lightThemes = [];
    const darkThemes = [];

    Object.entries(THEMES).forEach(([lightOrDark, themeObj]) => {
        const currentTheme = lightOrDark === 'light' ? lightThemes : darkThemes;
        Object.entries(themeObj).forEach(([name, data]) => {
            const parentProps = {
                className: `light-or-dark ${lightOrDark}`,
                key: `${name}-${lightOrDark}`,
                onClick: () => setTheme({...data, mode: lightOrDark, name})
            };
            const childProps = {
                className: `theme-option`,
                style: {[data.style] : data.color}
            };
            const renderIcon = () => {
                if ((lightOrDark === theme.mode) && (name === theme.name)) {
                    return (<CheckCircleRoundedIcon className={"done"}/>);
                }
                return null;
            };
            currentTheme.push(
                <div {...parentProps}>
                    {renderIcon()}
                    <div {...childProps}/>
                </div>
            );
        });
    });

    return (
      <div className={"step-seven fade-in"}>
          <h1 className={"steps-title"}>
              OK, last question! <br/>
              <strong>
                  What is your favorite color? <span role={"img"} aria-label={"color palette emoji"}>&#127912;</span>
              </strong>
          </h1>
          <div className={'color-picker'}>
              <div className={"theme light"}>
                  {lightThemes}
              </div>
              <div className={'theme dark'}>
                  {darkThemes}
              </div>
          </div>
      </div>
    );
}

export default StepSeven;