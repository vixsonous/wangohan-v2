import z from "zod";
import {UserSchema} from "@/types/user-types.user";

export class RecipeDisplaySchema {

  static RecipeRatingData = z.object({
    avg_rating: z.number(),
    total_rating: z.number()
  }).nullable();

  static RecipeImageDisplay =  z.object({
    recipe_image_id: z.number(),
    recipe_image_title: z.string(),
    recipe_image_subtext: z.string(),
    recipe_image: z.string(),
    recipe_id: z.number()
  });

  static RecipeCardDisplay = z.object({
    recipe_name: z.string(),
    recipe_id: z.number(),
    recipe_description: z.string(),
    recipe_age_tag: z.string(),
    recipe_size_tag: z.string(),
    recipe_event_tag: z.string(),
    recipe_category: z.string(),
    total_likes: z.number(),
    total_views: z.number(),
    recipe_images: Array<typeof RecipeDisplaySchema.RecipeImageDisplay>,
    recipe_rating_data: RecipeDisplaySchema.RecipeRatingData,
    user_id: z.number(),
    created_at: z.date(),
  });

  static RecipeDetailsDisplayComments = z.object({
    recipe_comment_subtext: z.string(),
    recipe_comment_rating: z.number(),
    user: UserSchema.UserDisplay,
    created_at: z.date(),
  });

  static RecipeInstruction = z.object({
    recipe_instructions_text: z.string(),
  });

  static RecipeIngredient = z.object({
    recipe_ingredients_name: z.string(),
    recipe_ingredients_amount: z.string(),
  });

  static RecipeDetailsDisplay = z.object({
    recipe_name: z.string(),
    recipe_id: z.number(),
    recipe_description: z.string(),
    recipe_age_tag: z.string(),
    recipe_size_tag: z.string(),
    recipe_event_tag: z.string(),
    recipe_category: z.string(),
    total_likes: z.number(),
    total_views: z.number(),
    recipe_images: z.array(RecipeDisplaySchema.RecipeImageDisplay),
    recipe_rating_data: RecipeDisplaySchema.RecipeRatingData,
    recipe_instructions: z.array(RecipeDisplaySchema.RecipeInstruction),
    recipe_ingredients: z.array(RecipeDisplaySchema.RecipeIngredient),
    recipe_comments: z.array(RecipeDisplaySchema.RecipeDetailsDisplayComments),
    user: UserSchema.UserDisplay,
    created_at: z.date(),
  });
}

export class RecipeSchema {
  static RecipeIngredient = z.object({
    recipe_ingredient_id: z.number().optional(),
    recipe_ingredients_name: z.string().min(1, "Please input recipe ingredient"),
    recipe_ingredients_amount: z.string().min(1, "Please input recipe amount"),
  });

  static RecipeInstruction = z.object({
    recipe_instructions_id: z.number().optional(),
    recipe_instructions_text: z.string().min(1, "Please input recipe instructions")
  });

  static Recipe = z.object({
    recipe_id: z.string().optional(),
    recipe_name: z.string().min(1, "タイトルを入力してください").max(25, "文字オーバーしています"),
    recipe_description: z.string().min(1, "内容を入力してください"),
    recipe_instructions: z.array(RecipeSchema.RecipeInstruction).min(1, "Please input recipe instructions!"),
    recipe_ingredients: z.array(RecipeSchema.RecipeIngredient).min(1, "Please input recipe ingredients!"),
    checkbox_age: z.array(z.string().or(z.boolean()).optional()).optional(),
    checkbox_size: z.array(z.string().or(z.boolean()).optional()).optional(),
    checkbox_event: z.array(z.string().or(z.boolean()).optional()).optional(),
    recipe_age_tag: z.string(),
    recipe_size_tag: z.string(),
    recipe_event_tag: z.string(),
    user_id: z.string().optional()
  });

  static PostRecipe = RecipeSchema.Recipe.and(z.object({
    recipe_images: z.array(z.file()).min(1, "Please upload recipe images!")
  }));

  static UpdateRecipe = RecipeSchema.Recipe.and(z.object({
    recipe_images: z.array(RecipeDisplaySchema.RecipeImageDisplay.or(z.file())).min(1, "Please upload recipe images!"),
    delete_image_ids: z.array(z.object({
      delete_image_id: z.number(),
      delete_image_key: z.string(),
    })).optional(),
    delete_recipe_instruction_ids: z.array(z.number()).optional(),
    delete_recipe_ingredient_ids: z.array(z.number()).optional(),
  }));

  static GetBasicRecipe = z.object({
    recipe_id: z.number(),
    recipe_name: z.string(),
    recipe_image: z.string(),
    user_id: z.number(),
    updated_at: z.date(),
    created_at: z.date()
  });
}