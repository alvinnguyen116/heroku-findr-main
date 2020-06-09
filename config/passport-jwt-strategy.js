import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import UserLogin from '../model/UserLogin';

/**
 * @desc Configure a JWT Strategy.
 * The middleware authenticates a user and
 * stores a (UserLogin) inside of req.user for
 * easy access.
 */
export default function applyJwtStrategy(passport) {
    const verify = async (payload, done) => {
        try {
            const {email} = payload;
            const user = await UserLogin.findOne({email}).populate('userProfile');

            // Check if user exists by that email
            if (!user) {
                return done({message: "Invalid Email. Try registering for an account.", status: 401}, false);
            }
            return done(null, user);
        } catch (err) {
            return done({message: "Server error", status: 500});
        }
    };
    const options = {
        secretOrKey: process.env.JWT_ACCESS_TOKEN,
        ignoreExpiration: false,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    passport.use(new JWTStrategy(options, verify));
}



