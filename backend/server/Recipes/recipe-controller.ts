import { Request, Response } from "express";
import {ApiResponse} from "../utils/ApiUtils";
import { RecipeService } from "./recipe-service";
import { log } from "../utils/log";
import {CacheUtil, RecipeCacheKey, RecipeCacheUtil} from "../utils/redis";
import {RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";
import z from "zod";
import {getUserData} from "@/server/utils/server-utils";
import {RecipeControllerValidationSchema} from "@/server/types/recipe-types.controller";
import {recipeEvents} from "@/server/server";
import {EventSchema} from "@/server/types/event-types";
import {EventService} from "@/server/Event/event-service";
import {RecipeErrorMessage, RecipeSuccessMessage, RecipeUnauthorizedMessage} from "@/server/Recipes/recipe-messages";

export class RecipeController {

  static async getWeeklyRecipes(_: Request, res: Response) {
    const GET_WEEKLY_RECIPES_KEY = 'GET:weekly-recipes';
    const recipes = await CacheUtil.get<
      z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[],
      typeof RecipeService.getWeeklyRecipes
    >(
      GET_WEEKLY_RECIPES_KEY,
      RecipeService.getWeeklyRecipes
    );
    ApiResponse.success(res, RecipeSuccessMessage.SUCCESS_WEEKLY_RECIPE, recipes, 200);
  }

  static async getPopularRecipes(_: Request, res: Response) {
    const GET_POPULAR_RECIPES_KEY = 'GET:popular-recipes';
    const recipes = await CacheUtil.get<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[], typeof RecipeService.getPopularRecipes>(GET_POPULAR_RECIPES_KEY, RecipeService.getPopularRecipes);
    ApiResponse.success(res, RecipeSuccessMessage.SUCCESS_POPULAR_RECIPE, recipes, 200);
  }
  
  static async getRecipe(req: Request, res: Response) {
    const { is_edit, recipe_name} = req.query;
    const {recipe_id} = req.params;

    const GET_RECIPE_KEY = `GET:recipe_id=${recipe_id}&recipe_name=${recipe_name}`;

    if(Number.isNaN(recipe_id) || Number.isInteger(recipe_id) || recipe_id === undefined) {
      log(RecipeErrorMessage.INVALID_RECIPE_ID);
      ApiResponse.error(res, RecipeErrorMessage.INVALID_RECIPE_ID);
      return;
    }

    if(recipe_name === undefined) {
      log(RecipeErrorMessage.INVALID_RECIPE_NAME);
      ApiResponse.error(res, RecipeErrorMessage.INVALID_RECIPE_NAME);
      return;
    }
    
    const recipe = await CacheUtil.get<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>, typeof RecipeService.getRecipe>(
      GET_RECIPE_KEY,
      RecipeService.getRecipe, 120, Number(recipe_id), String(recipe_name), Boolean(is_edit)
    ).catch( (err: undefined) => err);

    if(recipe === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.UNSUCCESSFUL_RECIPE_RETRIEVAL);
      return;
    }

    log(RecipeSuccessMessage.SUCCESS_GET_RECIPE);
    ApiResponse.success(res, RecipeSuccessMessage.SUCCESS_GET_RECIPE, recipe);
  }

  static async uploadRecipe(req: Request, res: Response) {

    if(req.user === undefined) {
      ApiResponse.unauthorized(res, RecipeErrorMessage.UNAUTHORIZED);
      return;
    }

    const user = req.user as {user_id: number, username: string};

    const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[];

    const formData = req.body;
    
    const submitData = {
      ...formData,
      recipe_images: [...files],
      user_id: user.user_id
    }

    const submitParseResult = RecipeSchema.PostRecipe.safeParse(submitData);

    if(!submitParseResult.success) {
      const message = submitParseResult.error.issues[0].message;
      log(message);
      ApiResponse.error(res, message);
      return;
    }

    const insertRecipeId = await RecipeService.postRecipe(submitParseResult.data);

    if(insertRecipeId === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.RECIPE_UPLOAD_FAILED);
      return;
    }

    await RecipeCacheUtil.clearAllRecipesCache();
    ApiResponse.success(res, RecipeSuccessMessage.SUCCESS_POST_RECIPE);
  }

  static async updateRecipe(req: Request, res: Response) {

    const formData = req.body;

    const user = req.user ? req.user as {user_id: number, username: string} : undefined;

    if(user === undefined || (user.user_id !== Number(formData.user_id))) {

      ApiResponse.unauthorized(res, RecipeUnauthorizedMessage.UNAUTHORIZED_EDIT);
      return;
    }

    const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[];

    const submitData = {
      recipe_id: Number(formData.recipe_id),
      recipe_name: formData.recipe_name,
      recipe_description: formData.recipe_description,
      recipe_instructions: formData.recipe_instructions.map(
        (i: z.infer<typeof RecipeSchema.RecipeInstruction>) =>
          ({...i, recipe_instructions_id: i.recipe_instructions_id ? Number(i.recipe_instructions_id): undefined })
        ),
      recipe_ingredients: formData.recipe_ingredients.map( (i: z.infer<typeof RecipeSchema.RecipeIngredient>) =>
          ({...i, recipe_ingredient_id: i.recipe_ingredient_id ? Number(i.recipe_ingredient_id) : undefined})
        ),
      user_id: Number(formData.user_id),
      checkbox_size: formData.checkbox_size,
      checkbox_age: formData.checkbox_age,
      checkbox_event: formData.checkbox_event,
      recipe_event_tag: formData.recipe_event_tag,
      recipe_age_tag: formData.recipe_age_tag,
      recipe_size_tag: formData.recipe_size_tag,
      recipe_images: [...files],
      delete_image_ids: formData.delete_image_ids?.map(
        (i: z.infer<typeof RecipeSchema.ImageDeleteSchema>) =>
          ({delete_image_id: Number(i.delete_image_id), delete_image_key: i.delete_image_key})),
      delete_recipe_ingredient_ids: formData.delete_recipe_ingredient_ids?.map( (i: string) => Number(i)),
      delete_recipe_instruction_ids: formData.delete_recipe_instruction_ids?.map( (i: string) => Number(i)),
    } satisfies z.infer<typeof RecipeSchema.UpdateRecipe>;

    const submitParseResult = RecipeSchema.UpdateRecipe.safeParse(submitData);

    if(!submitParseResult.success) {
      ApiResponse.error(res, submitParseResult.error.issues[0].message);
      return;
    }

    await RecipeService.updateRecipe(submitParseResult.data);
    const GET_RECIPE_KEY = `GET:recipe_id=${submitParseResult.data.recipe_id}&recipe_name=${submitParseResult.data.recipe_name}`;
    await RecipeCacheUtil.clearAllRecipesCache();
    await CacheUtil.delete(GET_RECIPE_KEY);

    ApiResponse.success(res, RecipeSuccessMessage.UPDATE_RECIPE);
  }

  static async getLikedRecipes(req: Request, res: Response) {
    const {user_id} = req.params;
    const {page} = req.query;
    console.log(user_id);
    console.log("da user");

    const likedRecipes = await RecipeService.getLikedRecipe(Number(user_id), Number(page));

    if(likedRecipes === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.RETRIEVE_LIKED_RECIPES);
      return;
    }

    ApiResponse.success(res, RecipeSuccessMessage.RETRIEVE_LIKED_RECIPES, likedRecipes);
  }

  static async getOwnRecipes(req: Request, res: Response) {
    const {user_id} = req.params;
    const {page} = req.query;

    const ownedRecipes = await RecipeService.getOwnedRecipe(Number(user_id), Number(page));

    if(ownedRecipes === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.RETRIEVE_OWNED_RECIPES);
      return;
    }

    ApiResponse.success(res, RecipeSuccessMessage.RETRIEVE_OWNED_RECIPES, ownedRecipes);
  }

  static async getArchivedRecipes(req: Request, res: Response) {
    const {user_id} = req.params;
    const {page} = req.query;

    const archivedRecipes = await RecipeService.getArchivedRecipes(Number(user_id), Number(page));

    if(archivedRecipes === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.ARCHIVED_RECIPES);
      return;
    }

    ApiResponse.success(res, RecipeSuccessMessage.ARCHIVED_RECIPES, archivedRecipes);
  }

  static async archiveRecipe(req: Request, res: Response) {
    const {recipe_id} = req.params;
    const {recipe_name, recipe_user_id, is_archive} = req.query;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.error(res, RecipeUnauthorizedMessage.UNAUTHORIZED_ARCHIVE);
      return;
    }

    const submitData = {
      recipe_id: Number(recipe_id),
      recipe_name: recipe_name,
      recipe_user_id: Number(recipe_user_id),
      user_id: Number(user.user_id),
      is_archive: String(is_archive) === 'true',
    }

    const archiveRecipeParseResult = RecipeSchema.ArchiveRecipe.safeParse(submitData);

    if(!archiveRecipeParseResult.success) {
      ApiResponse.error(res, archiveRecipeParseResult.error.issues[0].message);
      return;
    }

    const softDeleteResult = await RecipeService.archiveRecipe(
      archiveRecipeParseResult.data.recipe_id,
      archiveRecipeParseResult.data.recipe_name,
      archiveRecipeParseResult.data.recipe_user_id,
      archiveRecipeParseResult.data.is_archive
    );

    if(!softDeleteResult) {
      ApiResponse.error(res, archiveRecipeParseResult.data.is_archive ? RecipeErrorMessage.ARCHIVE_RECIPE : RecipeErrorMessage.UNARCHIVE_RECIPE);
      return;
    }

    await RecipeCacheUtil.clearAllRecipesCache();
    await CacheUtil.delete(RecipeCacheKey.GET_RECIPE_KEY(String(archiveRecipeParseResult.data.recipe_id), archiveRecipeParseResult.data.recipe_name));

    ApiResponse.success(res, archiveRecipeParseResult.data.is_archive ? RecipeSuccessMessage.ARCHIVE_RECIPE : RecipeSuccessMessage.UNARCHIVE_RECIPE);
  }

  static async hardDeleteRecipe(req: Request, res: Response) {
    const {recipe_id} = req.params;
    const {recipe_name, recipe_user_id} = req.query;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.unauthorized(res, RecipeUnauthorizedMessage.LOGIN_REQUIRED);
      return;
    }

    if(user.user_id !== Number(recipe_user_id)) {
      ApiResponse.unauthorized(res, RecipeUnauthorizedMessage.UNAUTHORIZED_DELETE);
      return;
    }

    const submitData = {
      recipe_id: Number(recipe_id),
      recipe_name: recipe_name,
      recipe_user_id: Number(recipe_user_id),
      user_id: Number(user.user_id),
    }

    const hardDeleteParseResult = RecipeSchema.HardDeleteRecipe.safeParse(submitData);
    if(!hardDeleteParseResult.success) {
      ApiResponse.error(res, hardDeleteParseResult.error.issues[0].message);
      return;
    }

    const deleteResult = await RecipeService.hardDeleteRecipe(
      hardDeleteParseResult.data.recipe_id,
      hardDeleteParseResult.data.recipe_name,
      hardDeleteParseResult.data.recipe_user_id
    );

    if(!deleteResult) {
      ApiResponse.error(res, RecipeErrorMessage.DELETE_RECIPE);
      return;
    }

    await RecipeCacheUtil.clearAllRecipesCache();

    ApiResponse.success(res, RecipeSuccessMessage.DELETE_RECIPE);
  }

  static async getRecipeList(req: Request, res: Response) {
    const {page_no, search_text} = req.query;

    if(search_text !== undefined) {
      const searchRecipeParse = RecipeControllerValidationSchema.SearchRecipeList.safeParse({
        page_no: Number(page_no),
        search_text: search_text
      });

      if(!searchRecipeParse.success) {
        ApiResponse.error(res, RecipeErrorMessage.INVALID_PAGE);
        return;
      }

      const searchRecipeList = await CacheUtil.get<
        z.infer<typeof RecipeSchema.RecipeList>,
        typeof RecipeService.getSearchRecipeList
      >(RecipeCacheKey.GET_SEARCH_RECIPE_LIST(
        searchRecipeParse.data.page_no,
        searchRecipeParse.data.search_text
      ), RecipeService.getSearchRecipeList, 60, searchRecipeParse.data.page_no, searchRecipeParse.data.search_text);

      if(searchRecipeList === undefined) {
        ApiResponse.error(res, RecipeErrorMessage.RETRIEVE_RECIPES);
        return;
      }

      ApiResponse.success(res, RecipeSuccessMessage.RETRIEVE_RECIPES, searchRecipeList);
      return;
    } else {

      const pageParse = z.number().safeParse(Number(page_no));

      if(!pageParse.success) {
        ApiResponse.error(res, RecipeErrorMessage.INVALID_PAGE);
        return;
      }
      console.log("there");
      const recipeList = await CacheUtil.get<
        z.infer<typeof RecipeSchema.RecipeList>,
        typeof RecipeService.getRecipeList
      >(RecipeCacheKey.GET_RECIPE_LIST(pageParse.data), RecipeService.getRecipeList, 60, pageParse.data);
      console.log("here");
      console.log(recipeList);
      if(recipeList === undefined) {
        ApiResponse.error(res, RecipeErrorMessage.RETRIEVE_RECIPES);
        return;
      }

      ApiResponse.success(res, RecipeSuccessMessage.RETRIEVE_RECIPES, recipeList);
      return;
    }
  }

  static async viewedRecipe(req: Request, res: Response) {
    const {recipe_id} = req.params;

    const recipeIdParse = z.number().safeParse(Number(recipe_id));
    if(!recipeIdParse.success) {
      ApiResponse.error(res, RecipeErrorMessage.INVALID_RECIPE_ID);
      return;
    }

    const result = await RecipeService.viewedRecipe(recipeIdParse.data);

    if(!result) {
      ApiResponse.error(res, RecipeErrorMessage.VIEW_RECIPE);
      return;
    }

    ApiResponse.success(res, RecipeSuccessMessage.VIEW_RECIPE);
  }

  static async isLikedRecipe(req: Request, res: Response) {
    const {recipe_id} = req.params;
    console.log("is liekd recipe")

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.error(res, RecipeUnauthorizedMessage.LOGIN_REQUIRED);
      return;
    }

    const submitData = {
      recipe_id: Number(recipe_id),
      user_id: user.user_id
    }

    const isLikedRecipeParseResult = RecipeControllerValidationSchema.IsLikedRecipe.safeParse(submitData);

    if(!isLikedRecipeParseResult.success) {
      ApiResponse.error(res, isLikedRecipeParseResult.error.issues[0].message);
      return;
    }

    const isLiked = await RecipeService.isLikedRecipe(
      isLikedRecipeParseResult.data.recipe_id,
      isLikedRecipeParseResult.data.user_id
    );
    console.log("is liked ", isLiked);
    ApiResponse.success(res, RecipeSuccessMessage.IS_LIKED_RECIPE, {is_liked: isLiked});
  }

  static async likeRecipe(req: Request, res: Response) {
    const {recipe_id} = req.params;
    const { is_liked, recipe_name, notification_date} = req.body;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.error(res, RecipeUnauthorizedMessage.LOGIN_REQUIRED);
      return;
    }

    const submitData = {
      recipe_id: Number(recipe_id),
      is_liked: is_liked,
      user_id: user.user_id,
      recipe_name: recipe_name,
    }

    const likeRecipeParseResult = RecipeControllerValidationSchema.LikeRecipe.safeParse(submitData);

    if(!likeRecipeParseResult.success) {
      ApiResponse.error(res, likeRecipeParseResult.error.issues[0].message);
      return;
    }

    const isLiked = await RecipeService.likeRecipe(
      likeRecipeParseResult.data.recipe_id,
      likeRecipeParseResult.data.user_id,
      likeRecipeParseResult.data.is_liked
    );

    if(isLiked === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.LIKE_RECIPE);
      return;
    }

    await RecipeCacheUtil.clearAllRecipesCache();
    await RecipeCacheUtil.clearRecipeCache(likeRecipeParseResult.data.recipe_id, likeRecipeParseResult.data.recipe_name);

    const owner = await RecipeService.getRecipeOwner(likeRecipeParseResult.data.recipe_id);

    if(owner === undefined || owner === null) {
      ApiResponse.success(res, likeRecipeParseResult.data.is_liked ? RecipeSuccessMessage.LIKE_RECIPE : RecipeSuccessMessage.UNLIKE_RECIPE);
      return;
    }

    const notification = await EventService.postNotification(
      owner.user_id,
      user.user_details?.user_codename!,
      user.user_details?.user_image!,
      false,
      "like",
      likeRecipeParseResult.data.is_liked,
      likeRecipeParseResult.data.recipe_id,
      likeRecipeParseResult.data.recipe_name,
      new Date(String(notification_date))
    );

    if(notification === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.NOTIFICATION_INSERT);
      return;
    }

    const sendData = {
      notification_id: notification.notification_id,
      type: likeRecipeParseResult.data.is_liked ? "like" : "unlike",
      recipe_id: likeRecipeParseResult.data.recipe_id,
      recipe_name: likeRecipeParseResult.data.recipe_name,
      user_codename: user.user_details?.user_codename,
      user_image: user.user_details?.user_image,
      is_read: false,
      notification_date: new Date(String(notification_date))
    };

    const notificationSendDataParseResult = EventSchema.Event.safeParse(sendData)

    if(!notificationSendDataParseResult.success) {
      log("Invalid notification data to send: " + notificationSendDataParseResult.error.issues[0].message);
      ApiResponse.error(res, notificationSendDataParseResult.error.issues[0].message);
      return;
    }

    recipeEvents.sendMessageToClient(
      JSON.stringify({...notificationSendDataParseResult.data, notification_id: notification.notification_id}),
      `user_id=${owner?.user_id}&user_codename=${owner?.user_codename}`
    );

    ApiResponse.success(res, likeRecipeParseResult.data.is_liked ? RecipeSuccessMessage.LIKE_RECIPE : RecipeSuccessMessage.UNLIKE_RECIPE);
  }

  static async postComment(req: Request, res: Response) {
    const data = req.body;

    const user = getUserData(req);

    if(user === undefined || user.user_details === undefined || user.user_details === null) {
      ApiResponse.error(res, RecipeUnauthorizedMessage.LOGIN_REQUIRED);
      return;
    }

    const submitData = {
      ...data,
      recipe_name: data.recipe_name,
      user_id: user.user_id,
      recipe_id: Number(data.recipe_id),
      rating: Number(data.rating),
      created_at: new Date(data.created_at)
    }

    const postCommentParseResult = RecipeControllerValidationSchema.PostComment.safeParse(submitData);

    if(!postCommentParseResult.success) {
      ApiResponse.error(res, postCommentParseResult.error.issues[0].message);
      return;
    }

    const submittedComment = await RecipeService.postComment(postCommentParseResult.data);

    if(submittedComment === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.POST_COMMENT);
      return;
    }

    await RecipeCacheUtil.clearRecipeCache(postCommentParseResult.data.recipe_id, postCommentParseResult.data.recipe_name);

    const owner = await RecipeService.getRecipeOwner(postCommentParseResult.data.recipe_id);

    if(owner === undefined || owner === null) {
      ApiResponse.success(res, RecipeSuccessMessage.POST_COMMENT, submittedComment);
      return;
    }

    const notification = await EventService.postNotification(
      owner.user_id,
      user.user_details.user_codename,
      user.user_details.user_image,
      false,
      "comment",
      true,
      postCommentParseResult.data.recipe_id,
      postCommentParseResult.data.recipe_name,
      postCommentParseResult.data.created_at
    );

    if(notification === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.NOTIFICATION_INSERT);
      return;
    }

    recipeEvents.sendMessageToClient(
      JSON.stringify({
        notification_id: notification.notification_id,
        type: "comment",
        recipe_id: postCommentParseResult.data.recipe_id,
        recipe_name: postCommentParseResult.data.recipe_name,
        user_codename: user.user_details?.user_codename,
        user_image: user.user_details?.user_image,
        notification_date: new Date()
      }),
      `user_id=${owner?.user_id}&user_codename=${owner?.user_codename}`
    );

    ApiResponse.success(res, RecipeSuccessMessage.POST_COMMENT, submittedComment);
  }

  static async getComments(req: Request, res: Response) {
    const {recipe_id, page} = req.query;

    const submitData = {
      recipe_id: Number(recipe_id),
      page: Number(page),
    }

    const getCommentsParseResult = RecipeControllerValidationSchema.GetComments.safeParse(submitData);

    if(!getCommentsParseResult.success) {
      console.error("Error!");
      log(getCommentsParseResult.error.issues[0].message);
      ApiResponse.error(res, getCommentsParseResult.error.issues[0].message);
      return;
    }

    const comments = await RecipeService.getComments(getCommentsParseResult.data.recipe_id, getCommentsParseResult.data.page);

    if(comments === undefined) {
      ApiResponse.error(res, RecipeErrorMessage.RETRIEVE_COMMENTS);
      return;
    }

    ApiResponse.success(res, RecipeSuccessMessage.RETRIEVE_COMMENTS, comments);
  }

  static async recipeEvents(req: Request, res: Response) {
    const {user_id, user_codename} = req.query;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.unauthorized(res, RecipeUnauthorizedMessage.LOGIN_REQUIRED);
      return;
    }

    if(Number(user_id) !== user.user_id || user.user_details?.user_codename !== user_codename) {
      ApiResponse.unauthorized(res, RecipeUnauthorizedMessage.UNAUTHORIZED_NOTIFICATION);
      return;
    }

    const origin = req.headers.origin;

    if(origin === process.env.BASE_URL) {
      res.setHeader("Access-Control-Allow-Origin", process.env.BASE_URL || "");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    const id = `user_id=${user_id}&user_codename=${user_codename}&room_id=${Date.now()}`;
    recipeEvents.addClient({id: id, res: res});

    req.on("close", () => {
      recipeEvents.removeClient(id);
      console.log(RecipeUnauthorizedMessage.USER_DISCONNECT);
    });
  }
}