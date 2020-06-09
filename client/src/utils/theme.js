import {createContext} from "react";
import * as colors from "@material-ui/core/colors";

export const THEME = Object.freeze({
    LIGHT: {
        primary: colors.pink,
        secondary: colors.lightBlue,
        default: colors.grey
    }
});

const createBackgroundColor = color => ({
   color,
   style: 'backgroundColor'
});

const createBackgroundImage = color => ({
    color,
    style: 'backgroundImage'
});

export const THEMES = Object.freeze({
   light: {
       default: createBackgroundColor('white'),
       yellow: createBackgroundColor('#fcf7bb'),
       orange: createBackgroundColor('#fce2ae'),
       lightPurple: createBackgroundColor('#f8e1f4'),
       lightGreen: createBackgroundColor('#d6f8b8'),
       babyRed: createBackgroundImage('linear-gradient(45deg, rgba(255,240,240,1) 0%, rgba(255,228,228,1) 50%, rgba(255,208,208,1) 100%)'),
       babyBlue: createBackgroundImage('linear-gradient(45deg, rgba(240,255,255,1) 0%, rgba(228,255,249,1) 50%, rgba(208,251,255,1) 100%)'),
       orangeYellow: createBackgroundImage('linear-gradient(45deg, rgba(255,255,240,1) 0%, rgba(255,251,228,1) 50%, rgba(255,239,208,1) 100%)'),
       bluePurple: createBackgroundImage('linear-gradient(45deg, rgba(213,215,255,1) 0%, rgba(218,210,255,1) 50%, rgba(220,195,255,1) 100%)'),
       blueRed: createBackgroundImage('linear-gradient(45deg, rgba(234,209,255,1) 0%, rgba(248,194,255,1) 50%, rgba(255,198,247,1) 100%)'),
       greenBlue: createBackgroundImage('linear-gradient(45deg, rgba(209,255,210,1) 0%, rgba(194,255,218,1) 50%, rgba(198,253,255,1) 100%)'),
       doubleBlue: createBackgroundImage('linear-gradient(45deg, rgba(178,255,252,1) 0%, rgba(150,219,219,1) 54%, rgba(103,219,226,1) 100%)')
   },
   dark: {
       default: createBackgroundColor('#212121'),
       purple: createBackgroundColor('#9c27b0'),
       oliveGreen: createBackgroundColor('#616f39'),
       blue: createBackgroundColor('#3f51b5'),
       teal: createBackgroundColor('#009688'),
       orange: createBackgroundColor('#ff5722'),
       blueGrey: createBackgroundColor('#607d8b'),
       brown: createBackgroundColor('#795548'),
       babyPink: createBackgroundColor('#ff6363'),
       redOrange: createBackgroundImage('linear-gradient(45deg,#ff0079,#ffb800)'),
       beach: createBackgroundImage('linear-gradient(45deg, rgba(0,146,255,1) 0%, rgba(0,198,169,1) 52%,  rgba(0,255,128,1) 100%)'),
       valentine: createBackgroundImage('linear-gradient(45deg, rgba(146,71,71,1) 0%, rgba(255,0,68,1) 100%)')

   }
});

export const ThemeContext = createContext(THEME.LIGHT);

