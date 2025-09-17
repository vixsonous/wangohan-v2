import {Router} from "express";
import {BlogController} from "@/server/Blog/blog-controller";

export const blogRouter = Router();

blogRouter.put("/:blog_id", BlogController.putBlog);
blogRouter.post("/", BlogController.postBlog);
blogRouter.get("/:blog_id/:blog_title", BlogController.getBlog);