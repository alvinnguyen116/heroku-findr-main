import {Schema, model} from 'mongoose';
import {isValidToken} from '../util/validators';

const TokenSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        validate: isValidToken
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Number,
        required: false
    }
});

export default new model('Token', TokenSchema);
