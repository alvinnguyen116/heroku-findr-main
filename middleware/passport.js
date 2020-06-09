import passport from 'passport';
import UserLogin from '../model/UserLogin';
import applyJwtStrategy from "../config/passport-jwt-strategy";

/**
 * @desc Import passport and use a JWT strategy for
 * resource authorization.
 */
applyJwtStrategy(passport);
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