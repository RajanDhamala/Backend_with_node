import  Router  from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.millerware.js";

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

export default router;
