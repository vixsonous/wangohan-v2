import {Router} from "express";
import {AdminController} from "@/server/Admin/admin-controller";
import {Middleware} from "@/server/utils/middleware";

export const adminRouter = Router();

adminRouter.get("/recipes", Middleware.superAdmin , AdminController.getAllRecipes);