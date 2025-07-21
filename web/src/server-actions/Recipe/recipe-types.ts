import { UserDisplay } from "../User/user-types";

export interface RecipeRatingData {
  avg_rating: number;
  total_rating: number;
}

export interface RecipeDisplayDetails {
  recipe_name: string;
  recipe_id: number;
  recipe_description: string;
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  recipe_category: string;
  total_likes: number;
  total_views: number;
  recipe_images: Array<RecipeImageDisplay>;
  recipe_rating_data: RecipeRatingData | null;
  user_id: number;
  created_at: Date;
}

export interface RecipeImageDisplay {
  recipe_image_id: number;
  recipe_image_title: string;
  recipe_image_subtext: string;
  recipe_image: string;
  recipe_id: number;
}

export interface RecipeDetailsDisplayComments {
  recipe_comment_subtext: string;
  recipe_comment_rating: number;
  user: UserDisplay | null;
  created_at: Date;
}

export interface RecipeInstruction {
  recipe_instructions_text: string;
}

export interface RecipeIngredient {
  recipe_ingredients_name: string;
  recipe_ingredients_amount: string;
}

export interface RecipeDetailsDisplay {
  recipe_name: string;
  recipe_id: number;
  recipe_description: string;
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  recipe_category: string;
  total_likes: number;
  total_views: number;
  recipe_images: Array<RecipeImageDisplay>;
  recipe_rating_data: RecipeRatingData | null;
  recipe_instructions: Array<RecipeInstruction>;
  recipe_ingredients: Array<RecipeIngredient>;
  recipe_comments: Array<RecipeDetailsDisplayComments>;
  user_id: number;
  created_at: Date;
}