import  Router  from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken
,getCurrentUser,changeCurrentPassword,updateUserAvatar,updateUserCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.millerware.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/v1/users/register
router.route("/register").post(
    upload.fields([
        {
            name:"avatar"
            ,maxcount:1
        },
        {
            name:"coverImage",
            maxcount:1
        }
    ])
    ,registerUser);
    router.route("/login").post(loginUser);

    //secured route
    router.route("/logout").post(verifyJWt, logoutUser);
    router.route("/refreshToken").post(refreshAccessToken);
    router.route("/getCurrentUser").post(getCurrentUser);
    router.route("/changePassword").post(verifyJWt,changeCurrentPassword);

    router.route("/change-password").post(verifyJWt,changeCurrentPassword);

    router.route("/current-user").get(verifyJWt,getCurrentUser);
    


export default router;
