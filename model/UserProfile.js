import {Schema, model} from 'mongoose';
import {isValidRole} from '../util/validators';

/**
 * @desc A schema for a Gif.
 */
const gif = new Schema({
    url: String,
    height: String,
    width: String
});

/**
 * @desc A schema for describing a user profile.
 */
const UserProfileSchema = new Schema({
    catchphrase: {
        font: String,
        quote: String
    },
    profilePicture: {
        original: String,
        cropped: String
    },
    gifs: [gif],
    name: {
        first: String,
        last: String
    },
    tags: [String],
    aboutMe: String,
    theme: {
        name: String,
        mode: String,
        style: String,
        color: String
    },
    role: {
        type: String,
        required: true,
        validator: isValidRole,
        immutable: true
    }
});

export default new model("UserProfile", UserProfileSchema);
