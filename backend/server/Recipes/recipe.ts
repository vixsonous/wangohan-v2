import z from "zod";
import {RecipeDisplaySchema} from "@/server/types/recipe-types";


export class RecipeModel {
  private recipe_id: number;
  private recipe_name: string;
  private recipe_description: string;
  private recipe_age_tag: string;
  private recipe_size_tag: string;
  private recipe_event_tag: string;
  private recipe_category: string;
  private total_likes: number;
  private total_favourites: number;
  private total_views: number;
  private user_id: number;
  private recipe_images: Array<z.infer<typeof RecipeDisplaySchema.RecipeImageDisplay>>;
  private recipe_rating_data: z.infer<typeof RecipeDisplaySchema.RecipeRatingData>;
  private updated_at: Date;
  private created_at: Date;
  
  constructor(recipe_id: number, recipe_name: string, recipe_description: string, recipe_age_tag: string,
    recipe_size_tag: string, recipe_event_tag: string, recipe_category: string, total_likes: number,
    total_favourites: number, total_views: number, user_id: number, recipe_images: Array<z.infer<typeof RecipeDisplaySchema.RecipeImageDisplay>>, recipe_rating_data: z.infer<typeof RecipeDisplaySchema.RecipeRatingData>, updated_at: Date, created_at: Date
  ) {
    this.recipe_id = recipe_id;
    this.recipe_name = recipe_name;
    this.recipe_description = recipe_description;
    this.recipe_age_tag = recipe_age_tag;
    this.recipe_size_tag = recipe_size_tag;
    this.recipe_event_tag = recipe_event_tag;
    this.recipe_category = recipe_category;
    this.total_likes = total_likes;
    this.total_favourites = total_favourites;
    this.total_views = total_views;
    this.user_id = user_id;
    this.recipe_images = recipe_images;
    this.recipe_rating_data = recipe_rating_data;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }
}