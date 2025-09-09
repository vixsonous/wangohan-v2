import {Request, Response} from "express";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {BlogControllerSchema} from "@/server/Blog/blog-types";
import {BlogService} from "@/server/Blog/blog-service";

export class BlogController {
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
}