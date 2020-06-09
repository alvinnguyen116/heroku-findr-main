/**
 * @param role
 * @desc Role authentication middleware.
 * Returns an error if there is no role or the
 * role does not match. Calls next() otherwise.
 */
export const authRole = role => (req,res,next) => {
    try {
        if (req.user.userProfile.role !== role) {
            return res.sendStatus(401);
        }
    } catch (err) {
        return res.sendStatus(500);
    }
    next();
};

