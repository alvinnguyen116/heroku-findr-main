import React, {useEffect} from 'react';
import {AppProvider} from "./utils";
import ReactDOM from 'react-dom';
import App from './components/app/App';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';

function Main() {

    useEffect(() => {
        const css = document.querySelector('#css-server-side');
        if (css) {
            css.parentElement.removeChild(css);
        }
    }, []);

    return (
        <Router>
            <AppProvider>
                <App />
            </AppProvider>
        </Router>
    );
}

ReactDOM.hydrate(<Main/>, document.getElementById('root'));

