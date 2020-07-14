import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import finalReducer from './reducers';
import thunk from "redux-thunk";

const middleware = applyMiddleware(logger,thunk); // remove logger in production
// const middleware = applyMiddleware(thunk);

export default createStore(finalReducer, middleware);