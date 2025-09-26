import {Router} from "express";
import {ImageController} from "@/server/Images/image-controller";

export const imageRouter = Router();

imageRouter.get("/transform", ImageController.transformImage)