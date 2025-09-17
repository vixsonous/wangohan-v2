import {Router} from "express";
import {BlogController} from "@/server/Blog/blog-controller";
import multer from "multer";
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

export const blogRouter = Router();

blogRouter.get("/", BlogController.getBlogs);
blogRouter.get("/:blog_id/:blog_title", BlogController.getBlog);
blogRouter.put("/:blog_id", BlogController.putBlog);
blogRouter.post("/", BlogController.postBlog);

export const blogImagesRouter = Router();

blogImagesRouter.get("/", BlogController.getBlogImages);
blogImagesRouter.post("/", upload.single('blog_image'), BlogController.postBlogImage);
