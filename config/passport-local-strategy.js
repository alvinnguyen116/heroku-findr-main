import {Strategy as LocalStrategy} from 'passport-local';
import UserLogin from '../model/UserLogin';
import bcrypt from 'bcryptjs';

/**
 * @desc Configure a local strategy (email, password).
 * The middleware authenticates a user and stores the
 * email inside of req.user for easy access.
 */
export default function applyLocalStrategy(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const userLogin = await UserLogin.findOne({email});

            // Check email against database
            if (!userLogin) {
                return done({message: 'Invalid Email. Try creating an account instead.', status: 401});
            }

            // Check password against hashed password
            if (await bcrypt.compare(password, userLogin.hashedPassword)) {
                return done(false, userLogin);
            }
            return done({message: 'Incorrect Password', status: 401});
        } catch (e) {
            return done({message: 'Server Error', status: 500});
        }
    };
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));
}

