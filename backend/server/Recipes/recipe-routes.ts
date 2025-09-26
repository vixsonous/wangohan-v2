import {Router} from "express";
import {RecipeController} from "@/server/Recipes/recipe-controller";
import multer from "multer";

const sliderRecipesRouter = Router();

sliderRecipesRouter.get("/weekly", RecipeController.getWeeklyRecipes);
sliderRecipesRouter.get("/popular", RecipeController.getPopularRecipes);

const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

export const recipeRouter = Router();

recipeRouter.get("/", RecipeController.getRecipeList);
recipeRouter.post("/", upload.array('recipe_images[]'), RecipeController.uploadRecipe);
recipeRouter.put("/", upload.array("recipe_images[]"), RecipeController.updateRecipe);
recipeRouter.get("/:recipe_id", RecipeController.getRecipe);
recipeRouter.patch("/:recipe_id/views", RecipeController.viewedRecipe);
recipeRouter.post("/:recipe_id/likes", RecipeController.likeRecipe);
recipeRouter.get("/:recipe_id/status/liked", RecipeController.isLikedRecipe);
recipeRouter.patch("/:recipe_id/archive", RecipeController.archiveRecipe);
recipeRouter.delete("/:recipe_id", RecipeController.hardDeleteRecipe);
recipeRouter.use("/slider", sliderRecipesRouter);
