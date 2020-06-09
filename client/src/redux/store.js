import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import finalReducer from './reducers';
import thunk from "redux-thunk";

const middleware = applyMiddleware(logger,thunk);
// const middleware = applyMiddleware(thunk); // remove logger in production

export default createStore(finalReducer, middleware);