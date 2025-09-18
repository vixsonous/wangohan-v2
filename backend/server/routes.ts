import { Router } from "express";
import {RecipeController} from "./Recipes/recipe-controller";
import multer from 'multer';
import { blogRouter} from "@/server/Blog/blog-routes";
import {eventRouter} from "@/server/Event/event-routes";
import {petRouter} from "@/server/Pet/pet-routes";
import {authRouter, googleRouter, userRouter} from "@/server/User/user-routes";
import {imageRouter} from "@/server/Images/image-routes";

export const router = Router();
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

router.get("/get-recipe", RecipeController.getRecipe);
router.get("/get-recipe-list", RecipeController.getRecipeList);
router.get("/get-search-recipe-list", RecipeController.getSearchRecipeList);
router.get("/viewed-recipe", RecipeController.viewedRecipe);
router.get("/like-recipe", RecipeController.likeRecipe);
router.get("/is-liked", RecipeController.isLikedRecipe);
router.post("/post-comment", RecipeController.postComment);
router.get("/get-comments", RecipeController.getComments);
router.post("/post-recipe", upload.array('recipe_images[]'), RecipeController.uploadRecipe);
router.post("/update-recipe", upload.array("recipe_images[]"), RecipeController.updateRecipe);
router.delete("/archive-recipe", RecipeController.archiveRecipe);
router.delete("/hard-delete-recipe", RecipeController.hardDeleteRecipe);
router.get("/get-weekly-recipes", RecipeController.getWeeklyRecipes);
router.get("/get-popular-recipes", RecipeController.getPopularRecipes);
router.get("/get-liked-recipes", RecipeController.getLikedRecipes);
router.get("/get-owned-recipes", RecipeController.getOwnRecipes);
router.get("/get-archived-recipes", RecipeController.getArchivedRecipes);

// Images
router.use("/images", imageRouter);

// User
router.use("/users", userRouter);
router.use("/google", googleRouter);
router.use("/auth", authRouter);

// Pets
router.use("/pets", petRouter);

// Events
router.use("/events", eventRouter)

// Blogs
router.use("/blogs", blogRouter);