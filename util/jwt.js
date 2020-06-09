import jwt from 'jsonwebtoken';
import Token from '../model/Token';
import {COOKIE, TOKENS} from '../util/enums';

/**
 * @param user
 * @desc Generates an access token signed by
 * JWT for a specific user.
 */
export function generateAccessToken(user) {
    const {email} = user;
    return jwt.sign({email}, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' })
}

/**
 * @param user
 * @desc Generates a refresh token signed by
 * JWT for a specific user.
 */
export function generateRefreshToken(user) {
    const {email} = user;
    return jwt.sign({email}, process.env.JWT_REFRESH_TOKEN);
}

/**
 * @param res
 * @param refreshToken
 * @desc Verify refresh token against secret.
 * Sends 403 on invalid request, else generate
 * a new token.
 */
export function verifyAndSendNewToken({res, refreshToken}) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).json({err: "Not a verified Token according to JWT"});
        const accessToken = generateAccessToken(user);
        res.status(201).json({accessToken});
    })
}

/**
 * @param res
 * @param user
 * @desc Generates an access token and refresh token.
 * Saves the refresh token in an http only cookie.
 */
export function sendAccessAndRefreshTokens({res, user}) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const NewRefreshToken = new Token({
        type: TOKENS.REFRESH_TOKEN,
        createAt: +(new Date()),
        value: refreshToken
    });

    // Save Refresh Token in DB
    NewRefreshToken.save(err => {
        if (err) return res.status(400).json({err: "Refresh token validations error."});

        // Store refresh token in httpOnly cookie
        res.cookie(COOKIE.REFRESH_TOKEN, String(refreshToken), {httpOnly: true});
        res.cookie(COOKIE.LOGGED_IN, String(true));

        // Send access token
        res.status(200).json({accessToken});
    });
}