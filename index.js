import {} from 'dotenv/config';
import "regenerator-runtime/runtime.js";
import React from 'react';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import mongooseInitialize from './config/mongoose';
import {passport} from './middleware/passport';
import UserProfileRouter from './route/UserProfile';
import ClientRouter from './route/Client';
import setUpImageRoutes from "./route/Image";
import {BUCKET} from './util/enums';

//todo: server side react

// CONSTANTS -----------------------------------------------------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 3000;
const ORIGIN = {
    LOCAL: "http://localhost:3000",
    PROD: "https://findr-frontend.herokuapp.com"
};

// MIDDLEWARE ----------------------------------------------------------------------------------------------------------

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cors({ // allow cookies
    origin: process.env.NODE_ENV === "development" ? ORIGIN.LOCAL : ORIGIN.PROD,
    credentials: true
}));
app.use(express.json({ // allow larger limit for images
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(passport.initialize());
app.use('/profile', UserProfileRouter);

// DATABASE ------------------------------------------------------------------------------------------------------------

mongooseInitialize({mongoose, DB_URI: process.env.ATLAS_URI});
mongoose.connection.once('open', () => {
    // Create a bucket for storing profile image
    const Bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: BUCKET.USER_PROFILE
    });

    // Set image routes
    const ImageRoutes = setUpImageRoutes({mongoose, Bucket});
    app.use('/image', ImageRoutes);
    app.use(ClientRouter);

    // Serve app once database is ready
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});

