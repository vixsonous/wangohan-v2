import {Request, Response} from "express";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {BlogControllerSchema, PostBlogImageSchema, PostBlogSchema} from "@/server/Blog/blog-types";
import {BlogService} from "@/server/Blog/blog-service";
import {getUserData} from "@/server/utils/server-utils";

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

  static async postBlog(req: Request, res: Response) {
    const data = req.body;
    const {publish} = req.query;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.unauthorized(res, "You need to login to post blog!");
      return;
    }

    const postBlogParseResult = PostBlogSchema.PostBlog.safeParse(data);

    if(!postBlogParseResult.success){
      ApiResponse.error(res, postBlogParseResult.error.issues[0].message);
      return;
    }

    const blog = await BlogService.postBlog(postBlogParseResult.data, publish === 'true', user.user_id);

    if(blog === undefined || !blog) {
      ApiResponse.error(res, "Failed to post blog!");
      return;
    }

    ApiResponse.success(res, "Successfully posted the blog!");
  }

  static async getBlogs(req: Request, res: Response) {
    const {page_no, category} = req.query;
    const submitData = {
      page_no: Number(page_no) - 1,
      category: category === "undefined" ? "全て" : category,
    }

    const getBlogsParseResult = BlogControllerSchema.GetBlogs.safeParse(submitData);

    if(!getBlogsParseResult.success) {
      ApiResponse.error(res, getBlogsParseResult.error.issues[0].message);
      return;
    }

    const blogList = await BlogService.getBlogs(getBlogsParseResult.data.page_no, getBlogsParseResult.data.category );

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

  static async postBlogImage(req: Request, res: Response) {
    const blog_image = req.file;
    const {blog_image_title} = req.body;

    const submitData = {
      blog_image_title: blog_image_title,
      blog_image: blog_image,
    }

    const postBlogImageParseResult = PostBlogImageSchema.PostBlogImage.safeParse(submitData);
    if(!postBlogImageParseResult.success){
      ApiResponse.error(res, postBlogImageParseResult.error.issues[0].message);
      return;
    }

    const blogImage = await BlogService.postBlogImage(
      postBlogImageParseResult.data.blog_image,
      postBlogImageParseResult.data.blog_image_title
    );

    if(blogImage === undefined) {
      ApiResponse.error(res, "Error uploading blog image!");
      return;
    }

    ApiResponse.success(res, "Successfully posted the blog image!", blogImage);
  }
}