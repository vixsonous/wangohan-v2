import { Router } from "express";
import { blogRouter} from "@/server/Blog/blog-routes";
import {eventRouter} from "@/server/Event/event-routes";
import {petRouter} from "@/server/Pet/pet-routes";
import {authRouter, googleRouter, userRouter} from "@/server/User/user-routes";
import {imageRouter} from "@/server/Images/image-routes";
import {recipeRouter} from "@/server/Recipes/recipe-routes";
import {commentRouter} from "@/server/Recipes/comment-routes";

export const router = Router();

router.use("/comments", commentRouter);
router.use("/recipes", recipeRouter);
router.use("/images", imageRouter);
router.use("/users", userRouter);
router.use("/google", googleRouter);
router.use("/auth", authRouter);
router.use("/pets", petRouter);
router.use("/events", eventRouter)
router.use("/blogs", blogRouter);