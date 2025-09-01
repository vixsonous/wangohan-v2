import z from "zod";

export class RecipeControllerValidationSchema {
  static SearchRecipeList = z.object({
    page_no: z.number("Must be a valid page number!"),
    search_text: z.string("Must be a valid search text!").min(1, "Please provide the search text!")
  })
}