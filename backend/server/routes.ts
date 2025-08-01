import { Router } from "express";
import {RecipeController} from "./Recipes/recipe-controller";
import { ImageController } from "./Images/image-controller";
import { UserController } from "./User/user-controller";
import passport from './utils/passport';

export const router = Router();

router.get("/get-recipe", RecipeController.getRecipe);
router.post("/post-recipe", RecipeController.uploadRecipe);
router.get("/get-weekly-recipes", RecipeController.getWeeklyRecipes);
router.get("/get-popular-recipes", RecipeController.getPopularRecipes);

// Images
router.get("/transform-image", ImageController.transformImage);

// User
router.get("/get-user", UserController.getUser);
router.post("/login", passport.authenticate('local'), UserController.login);
router.post("/register", UserController.register);
router.get("/is-authenticated", UserController.isAuthenticated);