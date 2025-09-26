import {Router} from "express";
import {RecipeController} from "@/server/Recipes/recipe-controller";
import {EventController} from "@/server/Event/event-controller";

export const eventRouter = Router();

eventRouter.get("/", RecipeController.recipeEvents);
eventRouter.get("/read", EventController.setUserNotificationsRead);
eventRouter.get("/notifications/:notification_id/status/read", EventController.readNotification);