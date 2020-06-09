import {Router} from 'express';
import cookie from 'cookie';
import {COOKIE, TOKENS, ROLE} from '../util/enums';
import Token from '../model/Token';
import UserLogin from '../model/UserLogin';
import UserProfile from '../model/UserProfile';
import {verifyAndSendNewToken, sendAccessAndRefreshTokens} from '../util/jwt';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * @desc Logs out a user.
 * Looks for a refresh token in the cookies
 * and removes it.
 */
router.route('/logout').delete(async (req, res) => {
    const usersCookie = cookie.parse(req.headers.cookie || '');
    const refreshToken = usersCookie[COOKIE.REFRESH_TOKEN];

    // Remove refresh token from DB
    // May have stale tokens if users cleared their cookies
    if (refreshToken) {
        try {
            // Delete the refresh token from DB
            await Token.deleteMany({type: TOKENS.REFRESH_TOKEN, value: refreshToken});
            res.clearCookie(COOKIE.REFRESH_TOKEN, {path: "/"});
            res.cookie(COOKIE.LOGGED_IN, String(false), {path: "/"});
        } catch (err) {
            res.status(500).json({err: "Failed to delete refresh token."});
        }
    }

    // Logs user out of Passport
    req.logOut();
    res.sendStatus(204);
});

/**
 * @desc Return a new token.
 * Looks for a refresh token in the cookies.
 */
router.route('/token').get(async (req, res) => {
    const usersCookie = cookie.parse(req.headers.cookie || '');
    const refreshToken = usersCookie[COOKIE.REFRESH_TOKEN];

    // Check for token in response
    if (!refreshToken) return res.status(401).json({err: "Missing refresh token in request"});

    try {
        // Check token against database
        const refreshTokenInDB = await Token.findOne({type: TOKENS.REFRESH_TOKEN, value: refreshToken});
        if (refreshTokenInDB === null) return res.status(403).json({err: "Invalid refresh token"});

        // Check token against signed key
        verifyAndSendNewToken({res, refreshToken});
    } catch (err) {
        res.status(500).json({err: "Could not access Token table."});
    }
});

/**
 * @desc Registers a new user if the email
 * does not already exists. Every new user
 * automatically gets an empty user profile.
 * Returns token (remove the need to login)
 */
router.route('/register').post(async (req,res) => {
    try {
        const {password, email} = req.body;
        if (!password || !email) return res.status(400).json({err: "Missing email or password."});

        // Check to see if email already exists
        const preExistingUser = await UserLogin.findOne({email});
        if (preExistingUser) return res.status(403).json({err: "Email already exists. Try logging in instead."});

        // Create a basic profile
        const role = ROLE.BASIC;
        const NewUserProfile = new UserProfile({role});

        // Attempt to save new user profile
        await NewUserProfile.save(async err => {
            if (err) return res.status(500).json({err: "Could not create a new user profile."});
            const {id: userProfile} = NewUserProfile;

            // Hash password for security
            const hashedPassword = await bcrypt.hash(password, 10);
            const NewUser = new UserLogin({userProfile, email, hashedPassword});

            // Save new user login
            NewUser.save(err => {
                if (err) return res.status(400).json({err: "Validation Error"});

                sendAccessAndRefreshTokens({user: {email}, res});
            });
        });
    } catch (e) {
        res.status(500).json({err: "Could not register"});
    }
});

export default router;