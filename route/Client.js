import React from "react";
import {Router} from 'express';
import {StaticRouter} from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {AppProvider} from "../client/src/utils";
import App from "../client/src/components/app/App";
import {sendFullPage} from "../util";

const router = Router();

router.route('/*').get((req,res) => {
    const context = {};

    const componentStream = ReactDOMServer.renderToNodeStream(
        <StaticRouter location={req.url} context={context}>
            <AppProvider>
                <App />
            </AppProvider>
        </StaticRouter>
    );

    if (context.url) {
        res.redirect(301, context.url);
    } else {
        sendFullPage({res, componentStream});
    }
});

export default router;