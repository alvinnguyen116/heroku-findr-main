import {Schema, model} from 'mongoose';
import {isValidEmail} from '../util/validators';

/**
 * A simple schema for logging in.
 * Points to an immutable UserProfile Model.
 */
const UserLoginSchema = new Schema({
   userProfile: {
       type: Schema.Types.ObjectId,
       ref: 'UserProfile',
       immutable: true
   },
   email: {
       type: String,
       required: true,
       trim: true,
       validate: isValidEmail
   },
   hashedPassword: {
       type: String,
       required: true,
       trim: true
   }
});

export default new model('UserLogin', UserLoginSchema);
