import passport from 'passport';
import UserLogin from '../model/UserLogin';
import applyJwtStrategy from "../config/passport-jwt-strategy";
import applyLocalStrategy from '../config/passport-local-strategy';

/**
 * @desc Apply Strategies to passport middleware.
 */
applyJwtStrategy(passport);
applyLocalStrategy(passport);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => done(null, await UserLogin.findById(id)));

/**
 * @desc Passport authentication middleware using a JWT strategy.
 */
const authJWT = passport.authenticate('jwt', {session: false});

export {
    passport,
    authJWT
};