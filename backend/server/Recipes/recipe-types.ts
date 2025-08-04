import { UserDisplay } from "../User/user-types";
import z from 'zod';

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

const RecipeIngredientSchema = z.object({
  recipe_ingredient: z.string().min(1, "Please input recipe ingredient"),
  recipe_amount: z.string().min(1, "Please input recipe amount"),
});

const RecipeInstructionSchema = z.object({
  recipe_instruction: z.string().min(1, "Please input recipe instructions")
});

export const RecipeSchema = z.object({
  recipe_title: z.string().min(1, "タイトルを入力してください").max(25, "文字オーバーしています"),
  recipe_description: z.string().min(1, "内容を入力してください"),
  recipe_instructions: z.array(RecipeInstructionSchema).min(1, "Please input recipe instructions!"),
  recipe_ingredients: z.array(RecipeIngredientSchema).min(1, "Please input recipe ingredients!"),
  checkbox_age: z.array(z.string().or(z.boolean()).optional()).optional(),
  checkbox_size: z.array(z.string().or(z.boolean()).optional()).optional(),
  checkbox_event: z.array(z.string().or(z.boolean()).optional()).optional()
});

export const PostRecipeSchema = RecipeSchema.and(z.object({
  recipe_images: z.array(z.custom<Express.Multer.File>()).min(1, "Please upload recipe images!"),
  user_id: z.number(),
}));