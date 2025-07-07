import { Router } from "express";
import { RecipeController } from "./controller/recipe-controller";
import { ImageController } from "./controller/image-controller";

export const router = Router();

router.get("/get-recipe", RecipeController.getRecipe);

// Images
router.get("/transform-image", ImageController.transformImage);