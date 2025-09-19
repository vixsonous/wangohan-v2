import {Router} from "express";
import {RecipeController} from "@/server/Recipes/recipe-controller";

export const commentRouter = Router();

commentRouter.post("/", RecipeController.postComment);
commentRouter.get("/", RecipeController.getComments);