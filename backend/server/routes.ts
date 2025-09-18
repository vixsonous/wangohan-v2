import { Router } from "express";
import {RecipeController} from "./Recipes/recipe-controller";
import { blogRouter} from "@/server/Blog/blog-routes";
import {eventRouter} from "@/server/Event/event-routes";
import {petRouter} from "@/server/Pet/pet-routes";
import {authRouter, googleRouter, userRouter} from "@/server/User/user-routes";
import {imageRouter} from "@/server/Images/image-routes";
import {recipeRouter} from "@/server/Recipes/recipe-routes";

export const router = Router();

router.post("/post-comment", RecipeController.postComment);
router.get("/get-comments", RecipeController.getComments);

router.use("/recipes", recipeRouter);

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