import { Router } from "express";
import {RecipeController} from "./Recipes/recipe-controller";
import { ImageController } from "./Images/image-controller";
import { UserController } from "./User/user-controller";
import multer from 'multer';
import {PetController} from "@/server/Pet/pet-controller";

export const router = Router();
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

router.get("/get-recipe", RecipeController.getRecipe);
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
router.get("/transform-image", ImageController.transformImage);

// User
router.get("/get-user", UserController.getUser);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/register", UserController.register);
router.get("/is-authenticated", UserController.isAuthenticated);
router.post("/personal-info", upload.single('user_image'), UserController.registerPersonalInfo);

// Pets
router.post("/post-pet", upload.single('pet_image'), PetController.postPet);
router.get("/birthday-pets", PetController.getBirthdayMonthPets);