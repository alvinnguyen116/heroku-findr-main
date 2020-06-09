import {Router} from 'express';
import {sendAccessAndRefreshTokens} from '../util/jwt';

//todo: add more login options such as gmail

const router = Router();
/**
 * @param passport
 * @desc Returns a router with login options given
 * a passport object.
 */
export default function createLoginRouter(passport) {
    // Login using local strategy as callback
    router.route('/local').post((req,res, next) => {
        passport.authenticate('local', {session: false}, (err, user, info) => {

            // Check for errors and send error message
            if (err) return res.status(err.status).json({err: err.message});
            if (!user) return res.status(400).json({err: "Login failed"});

            // Attempt to log user into passport
            req.login(user, {session: false}, err => {
                if (err) return res.status(500).json({err: "Passport login failed"});

                sendAccessAndRefreshTokens({user, res});
            });
        })(req,res);
    });

    return router;
}
