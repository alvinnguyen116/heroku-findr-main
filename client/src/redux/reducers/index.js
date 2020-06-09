import {combineReducers} from "redux";
import profile from './profile'
import app from './app';

export default combineReducers({app, profile});