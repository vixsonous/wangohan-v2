import z from "zod";

export class RecipeControllerValidationSchema {
  static SearchRecipeList = z.object({
    page_no: z.number("Must be a valid page number!"),
    search_text: z.string("Must be a valid search text!").min(1, "Please provide the search text!")
  });

  static LikeRecipe = z.object({
    recipe_id: z.number("Please provide a recipe id!"),
    user_id: z.number("You must be logged in to like a recipe!"),
    is_liked: z.boolean("Please provide a boolean value if the recipe is liked"),
    recipe_name: z.string("Please provide a recipe name!"),
  });

  static IsLikedRecipe = z.object({
    recipe_id: z.number("Please provide a recipe id!"),
    user_id: z.number("You must be logged in to like a recipe!"),
  });

  static PostComment = z.object({
    rating: z.number("Must be a valid rating!"),
    comment: z.string().min(1, "Please provide a comment!"),
    created_at: z.date("Please provide the date!"),
    user_id: z.number("You must be logged in to comment to a recipe!"),
    recipe_id: z.number("Please provide a recipe id!"),
    recipe_name: z.string("Please provide a recipe name!"),
  });

  static GetComments = z.object({
    recipe_id: z.number("Please provide a valid recipe id!"),
    page: z.number("Please provide a valid page number!")
  })
}