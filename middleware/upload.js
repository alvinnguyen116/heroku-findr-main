import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import {BUCKET} from '../util/enums';

/**
 * @desc Multer middleware for saving profile picture
 * to a specific bucket.
 */
const file =  () => ({bucketName: BUCKET.USER_PROFILE});
const storage = new GridFsStorage({url: process.env.ATLAS_URI, file});

export default multer({ storage });