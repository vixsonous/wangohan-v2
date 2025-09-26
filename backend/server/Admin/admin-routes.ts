import {Router} from "express";
import {AdminController} from "@/server/Admin/admin-controller";
import {Middleware} from "@/server/utils/middleware";

export const adminRouter = Router();

adminRouter.get("/data", Middleware.superAdmin , AdminController.getAdminData);
adminRouter.patch("/recipes/status/publish", Middleware.superAdmin, AdminController.publishRecipe);
adminRouter.patch("/blogs/status/publish", Middleware.superAdmin, AdminController.publishBlog);
adminRouter.delete("/recipes/:recipe_id", Middleware.superAdmin, AdminController.deleteRecipe);
adminRouter.delete("/blogs/:blog_id", Middleware.superAdmin, AdminController.deleteBlog);
adminRouter.patch("/users/:user_id/level", Middleware.superAdmin, AdminController.updateUserLevel);
adminRouter.delete("/users/:user_id", Middleware.superAdmin, AdminController.deleteUser);