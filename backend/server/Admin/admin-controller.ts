import {Request, Response} from 'express';
import {ApiResponse} from "@/server/utils/ApiUtils";
import {AdminService} from "@/server/Admin/admin-service";
import z from "zod";

export class AdminControllerSchema {
  static PublishRecipe = z.object({
    recipe_id: z.number("Please provide a valid recipe id!"),
    is_published: z.boolean("Please provide if published or not!"),
  });

  static DeleteRecipe = z.object({
    recipe_id: z.number("Please provide a valid recipe id!"),
    recipe_name: z.string("Please provide a valid recipe name!"),
  })

  static PublishBlog = z.object({
    blog_id: z.number("Please provide a valid blog id!"),
    is_published: z.boolean("Please provide if published or not!"),
  });

  static DeleteBlog = z.object({
    blog_id: z.number("Please provide a valid blog id!"),
    title: z.string("Please provide the blog title!")
  })
}

export class AdminController {
  static async getAdminData(req: Request, res: Response) {

    const data = await AdminService.getAdminData();

    ApiResponse.success(res, "Successfully retrieved admin data!", data);
  }

  static async publishRecipe(req: Request, res: Response) {
    const data = req.body;

    const publishRecipeParseResult = AdminControllerSchema.PublishRecipe.safeParse({
      recipe_id: data.id,
      is_published: data.publish,
    });

    if(!publishRecipeParseResult.success) {
      ApiResponse.error(res, publishRecipeParseResult.error.issues[0].message);
      return;
    }

    const result = await AdminService.publishRecipe(publishRecipeParseResult.data);

    if(!result) {
      ApiResponse.error(res, `There was an error ${data.published ? 'publishing' : 'unpublishing'} the recipe!`);
      return;
    }

    ApiResponse.success(res, "Successfully published recipe!", data);
  }

  static async deleteRecipe(req: Request, res: Response) {
    const recipe_id = req.params.recipe_id;
    const {recipe_name} = req.query;

    const deleteRecipeParseResult = AdminControllerSchema.DeleteRecipe.safeParse({
      recipe_id: Number(recipe_id),
      recipe_name: recipe_name,
    });

    if(!deleteRecipeParseResult.success) {
      ApiResponse.error(res, deleteRecipeParseResult.error.issues[0].message);
      return;
    }

    const result = await AdminService.deleteRecipe(deleteRecipeParseResult.data);

    if(!result) {
      ApiResponse.error(res, "There was an error deleting the recipe!");
      return;
    }

    ApiResponse.success(res, "Successfully deleted recipe!", {id: recipe_id});
  }

  static async publishBlog(req: Request, res: Response) {
    const data = req.body;

    const publishBlogParseResult = AdminControllerSchema.PublishBlog.safeParse({
      blog_id: data.id,
      is_published: data.publish,
    });

    if(!publishBlogParseResult.success) {
      ApiResponse.error(res, publishBlogParseResult.error.issues[0].message);
      return;
    }

    const result = await AdminService.publishBlog(publishBlogParseResult.data);

    if(!result) {
      ApiResponse.error(res,`There was an error ${data.published ? 'publishing' : 'unpublishing'} the blog!`);
      return;
    }

    ApiResponse.success(res, "Successfully published blog!", data);
  }

  static async deleteBlog(req: Request, res: Response) {
    const blog_id = req.params.blog_id;
    const {title} = req.query;

    const deleteBlogParseResult = AdminControllerSchema.DeleteBlog.safeParse({
      blog_id: Number(blog_id),
      title: title,
    });

    if(!deleteBlogParseResult.success) {
      ApiResponse.error(res, deleteBlogParseResult.error.issues[0].message);
      return;
    }

    const result = await AdminService.deleteBlog(deleteBlogParseResult.data);

    if(!result) {
      ApiResponse.error(res, "There was an error deleting the blog!");
      return;
    }

    ApiResponse.success(res, "Successfully deleted blog!", {id: deleteBlogParseResult.data.blog_id});
  }
}