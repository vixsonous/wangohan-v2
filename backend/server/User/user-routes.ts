import {Router} from "express";
import {UserController} from "@/server/User/user-controller";
import passport from "@/server/utils/passport";
import multer from "multer";
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

export const userRouter = Router();

userRouter.get("/", UserController.getUser);
userRouter.post("/", UserController.register);
userRouter.post("/me", upload.single('user_image'), UserController.registerPersonalInfo);
userRouter.put("/me", upload.single('user_image'), UserController.updatePersonalInfo);

export const googleRouter = Router();

googleRouter.get("/", passport.authenticate("google", {
  scope: ["profile", "email"]
}));
googleRouter.get("/redirect", UserController.googleLogin);

export const authRouter = Router();
authRouter.post("/login", UserController.login);
authRouter.post("/logout", UserController.logout);
authRouter.get("/status", UserController.isAuthenticated);