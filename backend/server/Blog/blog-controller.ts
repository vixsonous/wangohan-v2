import {Request, Response} from "express";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {BlogControllerSchema} from "@/server/Blog/blog-types";
import {BlogService} from "@/server/Blog/blog-service";

export class BlogController {

  static async getBlog(req: Request, res: Response) {
    const {blog_id, blog_title} = req.query;

    const submitData = {
      blog_id: Number(blog_id),
      blog_title: blog_title,
    }

    const getBlogParseResult = BlogControllerSchema.GetBlog.safeParse(submitData);

    if(!getBlogParseResult.success){
      ApiResponse.error(res, getBlogParseResult.error.issues[0].message);
      return;
    }

    const blog = await BlogService.getBlog(getBlogParseResult.data.blog_id, getBlogParseResult.data.blog_title);

    if(blog === undefined) {
      ApiResponse.error(res, "Failed to retrieve the blog!");
      return;
    }

    ApiResponse.success(res, "Successfully retrieved the blog!", blog);
  }

  static async getBlogs(req: Request, res: Response) {
    const {page_no, category} = req.query;
    const submitData = {
      page_no: Number(page_no) - 1,
      category: category,
    }

    const getBlogsParseResult = BlogControllerSchema.GetBlogs.safeParse(submitData);

    if(!getBlogsParseResult.success) {
      ApiResponse.error(res, getBlogsParseResult.error.issues[0].message);
      return;
    }

    const blogList = await BlogService.getBlogs(getBlogsParseResult.data.page_no, getBlogsParseResult.data.category);

    ApiResponse.success(res, "Successfully retrieved blogs!", blogList);
  }

  static async getBlogImages(req: Request, res: Response) {
    const {page_no} = req.query;

    const getBlogImagesParseResult = BlogControllerSchema.GetBlogImages.safeParse(Number(page_no) - 1);

    if(!getBlogImagesParseResult.success) {
      ApiResponse.error(res, getBlogImagesParseResult.error.issues[0].message);
      return;
    }

    const blogImages = await BlogService.getBlogImages(getBlogImagesParseResult.data);

    if(blogImages === undefined) {
      ApiResponse.error(res, "Failed to get blog images!");
      return;
    }

    ApiResponse.success(res, "Successfully retrieved blog images!", blogImages);
  }
}