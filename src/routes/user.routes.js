import  Router  from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
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


export default router;
