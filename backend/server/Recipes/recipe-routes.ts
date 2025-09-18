import {Router} from "express";
import {RecipeController} from "@/server/Recipes/recipe-controller";
import multer from "multer";

const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

export const recipeRouter = Router();

recipeRouter.get("/", RecipeController.getRecipeList);
recipeRouter.post("/", upload.array('recipe_images[]'), RecipeController.uploadRecipe);
recipeRouter.put("/", upload.array("recipe_images[]"), RecipeController.updateRecipe);
recipeRouter.get("/:recipe_id/:recipe_name", RecipeController.getRecipe);
recipeRouter.get("/search", RecipeController.getSearchRecipeList);
recipeRouter.patch("/:recipe_id/views", RecipeController.viewedRecipe);
recipeRouter.post("/:recipe_id/likes", RecipeController.likeRecipe);
recipeRouter.get("/:recipe_id/status/liked", RecipeController.isLikedRecipe);