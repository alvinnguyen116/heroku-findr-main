import {Router} from 'express';
import UserProfile from "../model/UserProfile";
import {authJWT} from "../middleware/passport";

/**
 * @param mongoose
 * @param Bucket
 * @desc Set up routes (GET, DELETE) for images.
 */
export default function setUpImageRoutes({mongoose, Bucket}) {
    const router = Router();
    // Retrieves an image by id
    router.route("/:id").get(async (req, res) => {

        // Check if id exists
        if (!req.params.id) return res.status(400).json({err: "Missing id param."});

        // Cast id to a mongoose Object ID
        const id = new mongoose.Types.ObjectId(req.params.id);
        try {
            const files = await Bucket.find({_id: id}).toArray();
            if (!files || files.length === 0) return res.status(404).json({err: "File does not exists"});

            // send file by stream to the response
            Bucket.openDownloadStream(id).pipe(res);
        } catch (err) {
            req.status(500).json({err: "Failed to retrieve image"});
        }
    });

    // Deletes an image by id
    router.route("/:id").delete(authJWT, (req,res) => {
        const {id} = req.params;

        // Check if id exists
        if (!id) return res.status(400).json({err: "Missing id param."});
        try {
            // Only the owner can delete their own picture
            if (req.user.userProfile.profilePicture.original !== id) return res.sendStatus(401);
            Bucket.delete(new mongoose.Types.ObjectId(id), err => {
                if (err) return res.sendStatus(404);

                // Delete the picture from the user's profile
                UserProfile.findByIdAndUpdate(req.user.userProfile.id, {profilePicture: {}}, err => {
                    if (err) return res.status(400).json({err});
                    res.sendStatus(204);
                });
            });
        } catch (err) {
            res.status(500).json({err: "Failed to delete image."});
        }
    });

    return router;
}
