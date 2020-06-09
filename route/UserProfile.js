import {Router} from 'express';
import UserProfile from '../model/UserProfile';
import upload from '../middleware/upload';
import {safeCastOptions} from '../util/index';
import {authJWT} from '../middleware/passport';

const router = Router();

/**
 * @desc Search for profiles based off a tag string.
 * Protect with passport JWT strategy.
 * Optional limit and offset can be applied.
 */
router.route("/search/").get(authJWT, async(req, res) => {
    try {
        const {tags} = req.query;
        const options = safeCastOptions(req.query);
        let data, total;

        if (!tags) {
             data = await UserProfile.find({}, null, options);
             total =  await UserProfile.countDocuments();
        } else {
            // Regular expression that matches words (OR)
            const tagArray = tags.split(new RegExp('\\W'));
            const regex = new RegExp(tagArray.join("|"), 'gim');

            // Apply regex
            data = await UserProfile.find({tags: {$regex: regex}}, null, options);
            total =  await UserProfile.countDocuments({tags: {$regex: regex}});
        }
        return res.status(200).json({data, total, ...options});
    } catch (e) {
        res.status(500).json({e});
    }
});

/**
 * @desc Gets the user data.
 * Protect with passport JWT strategy.
 */
router.route('/me').get(authJWT, (req,res) => {
    try {
        if (req.user.userProfile) { // req.user set by passport
            return res.status(200).json(req.user.userProfile);
        }
        res.status(500).json({err: "User Profile does not exists."})
    } catch (e) {
        res.status(500).send({err: "Failed to retrieve user."});
    }
});


/**
 * @desc Updates a user's profile.
 * Protect with passport JWT strategy.
 */
router.route("/update").post(authJWT, async (req,res) => {
    try {
        const {catchphrase, gifs, name, tags, aboutMe, theme} = req.body;
        const newProfile = {};

        // Only update if the object exists in the request
        if (catchphrase && catchphrase.quote && catchphrase.font) {
            newProfile.catchphrase = catchphrase;
        }
        if (gifs) {
            newProfile.gifs = gifs;
        }
        if (name && name.first && name.last) {
            newProfile.name = name;
        }
        if (tags) {
            newProfile.tags = tags;
        }
        if (aboutMe) {
            newProfile.aboutMe = aboutMe;
        }
        if (theme && theme.mode && theme.color && theme.name && theme.style) {
            newProfile.theme = theme;
        }

        // Attempt to update User Profile
        UserProfile.findByIdAndUpdate(req.user.userProfile.id, newProfile, err => {
            if (err) return res.status(400).json({err});
            res.sendStatus(204);
        });
    } catch (e) {
        res.status(500).json({err: 'Failed to update Profile.'});
    }
});

/**
 * @desc A dedicated route for updating your profile picture.
 * Automatically save files using Multer.
 */
router.route('/update/picture').post(authJWT, upload.fields([{name: 'original'}, {name: 'cropped'}]), (req,res) => {
    try {
        const {original, cropped} = req.files; // req.files set by Multer
        if (!original || !original.length) return res.status(400).json({err: 'Missing original file'});
        if (!cropped || !cropped.length) return res.status(400).json({err: 'Missing cropped file'});
        const profilePicture = {original: original[0].id, cropped: cropped[0].id};

        // Attempt to update the user's profile
        UserProfile.findByIdAndUpdate(req.user.userProfile.id, {profilePicture}, err => {
            if (err) return res.status(400).json({err});
            res.status(200).send(profilePicture);
        });
    } catch (e) {
        res.status(500).json({err: 'Failed to update Profile.'});
    }
});

// todo: create route for updating your password email

export default router;