import z from "zod";

export interface DogData {
  pet_id: number;
  pet_image: string;
  pet_name: string;
  pet_birthdate: string;
  pet_breed: string;
}

export interface ingredients {
  id: number;
  name: string;
  amount: string;
}

export interface instructions {
  id: number;
  text: string;
}

export interface UserDetails {
  pets?: DogData[];
  user_codename: string;
  user_detail_id: number;
  user_id: number;
  user_image: string;
}

export interface User {
  user_id: number;
  user_image: string;
  user_codename: string;
}

export interface Comment {
  recipe_comment_id: number;
  recipe_comment_rating: number;
  recipe_comment_subtext: string;
  recipe_comment_title: string;
  recipe_id: number;
  user_id: number;
  user: User;
  created_at: string;
}

export const FileDisplaySchema = z.array(z.object({
  file: z.file().min(1, "Please upload some pictures"),
  preview_url: z.string().min(1, "Please provide preview url")
}))

export const RecipeIngredientSchema = z.object({
  recipe_ingredient: z.string().min(1, "Please input recipe ingredient"),
  recipe_amount: z.string().min(1, "Please input recipe amount"),
});

export const RecipeInstructionSchema = z.object({
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