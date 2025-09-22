import {Request, Response} from 'express';
import {ApiResponse} from "@/server/utils/ApiUtils";
import {AdminService} from "@/server/Admin/admin-service";
import z from "zod";

export class AdminControllerSchema {
  static PublishRecipe = z.object({
    recipe_id: z.number("Please provide a valid recipe id!"),
    is_published: z.boolean("Please provide if published or not!"),
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
}